import json
import datetime
from os import path, getcwd, listdir
from pymongo import MongoClient
from dotenv import dotenv_values


def read_data_from_file(fp):
    data = {}
    with open(fp, 'r') as file:
        data = json.load(file)
    return data

def write_data_to_file(fp, data):
    with open(fp, 'w') as file:
        json.dump(data, file, indent=4)


def getUniqueTeamNames(events):
    teams = {}
    for event in events:
        competitors = event["competitions"][0]["competitors"]
        for competitor in competitors:
            team_data = competitor["team"]
            if team_data["id"] not in teams:
                teams[team_data["id"]] = {
                    "name": team_data.get("name", team_data.get("shortDisplayName", team_data["id"])),
                    "abbreviation": team_data["abbreviation"],
                    "displayName": team_data["displayName"],
                }
    return teams

def getUniqueMatchDates(events):
    dates = set()
    for event in events:
        event_date_iso = event["date"]
        event_date_datetime = datetime.datetime.fromisoformat(event_date_iso)
        event_date = event_date_datetime.date()
        dates.add(event_date)
    return dates


def formatStandings(dates, teams):
    standings = {}
    for date in dates:
        standings[str(date)] = {
            id : {
                "w": 0, "l": 0, "d": 0,
                "metadata": teams[id]
            } for id in teams
        }
    return standings

def processSeasonScoreboardData(data):
    league_prop = data["leagues"][0]
    season_data = league_prop["season"]
    events = data["events"]
    teams = getUniqueTeamNames(events)
    match_dates = getUniqueMatchDates(events)
    standings = formatStandings(match_dates, teams)
    return {
        "season": season_data["type"]["name"],
        "seasonYear": season_data["year"],
        "seasonId": season_data["displayName"],
        "leagueDisplayName": league_prop["name"],
        "logos": league_prop["logos"],
        "teams": teams,
        "standings": standings,
    }


def processTeamData(teams):
    data = {}
    for team in teams:
        team_homeAway = team["homeAway"]
        team_isWinner = team["winner"]
        team_score = team["score"]
        team_data = team["team"]
        data[team_homeAway] = {
            "homeAway": team_homeAway,
            "winner": team_isWinner,
            "score": team_score,
            "id": team_data["id"],
            "name": team_data["name"],
            "abbreviation": team_data["abbreviation"],
            "logos": team_data["logos"],
        }
    return data

def processPlayerData(metadata, data):
    player_data = data["athlete"]
    result = {
        "starter": data["starter"],
        "jersey": data["jersey"],
        "id": player_data["id"],
        "firstName": player_data.get("firstName", player_data.get("fullName").split()[0]),
        "lastName": player_data.get("lastName", player_data.get("fullName").split()[-1]),
        "displayName": player_data["displayName"],
        "status": "active" if data["active"] else "inactive",
        "metadata": metadata,
    }
    if data.get("position"):
        result["position"] = data["position"]["displayName"]
    return result

def processRosterData(data):
    result = {}
    for team_data in data:
        homeAway = team_data["homeAway"]
        player_metadata = {
            "teamName": team_data["team"]["displayName"],
            "teamId": team_data["team"]["id"]
        }
        result[homeAway] = {
            "players": [
                processPlayerData(player_metadata, player) for player in team_data["roster"]
            ]
        }
        if team_data.get("formation"):
            result[homeAway]["formation"] = team_data["formation"]
    return result

def processOddsData(data):
    result = []
    for odds_data in data:
        if not (odds_data.get("overUnder") and odds_data.get("overOdds") and odds_data.get("underOdds") and odds_data.get("spread")):
            continue
        odds_provider = odds_data["provider"]
        home_odds = odds_data["homeTeamOdds"]
        away_odds = odds_data["awayTeamOdds"]
        if "moneyLine" not in home_odds or "moneyLine" not in away_odds:
            continue

        odds = {
            "provider": {
                "id": odds_provider["id"],
                "name": odds_provider["name"],
            },
            "spread": odds_data["spread"],
            "overUnder": odds_data["overUnder"],
            "overOdds": odds_data["overOdds"],
            "underOdds": odds_data["underOdds"],
            "home": {
                "favorite": home_odds["favorite"],
                "underdog": home_odds["underdog"],
                "moneyLine": home_odds["moneyLine"],
                "spreadOdds": home_odds["spreadOdds"],
                "spread": odds_data["spread"]
            },
            "away": {
                "favorite": away_odds["favorite"],
                "underdog": away_odds["underdog"],
                "moneyLine": away_odds["moneyLine"],
                "spreadOdds": away_odds["spreadOdds"],
                "spread": odds_data["spread"]
            },
        }
        if "drawOdds" in odds_data:
            odds["drawOdds"] = odds_data["drawOdds"]["moneyLine"]
        result.append(odds)
    return result

def processMatchData(season_data, match_data):
    match_boxscore = match_data["boxscore"]
    match_header = match_data["header"]
    match_gameinfo = match_data["gameInfo"]
    match_header_competitions = match_header["competitions"][0]
    match_header_competitors = match_header_competitions["competitors"]
    match_venue = match_gameinfo["venue"]
    match_officials = match_gameinfo.get("officials", [])

    match_metadata = {
        "sport": season_data["sport"],
        "league": season_data["league"],
        "season": season_data["season"],
        "seasonYear": season_data["seasonYear"],
        "seasonId": season_data["seasonId"],
    }

    team_data = processTeamData(match_header_competitors)
    roster_data = {}
    if match_data.get("rosters"):
        roster_data = processRosterData(match_data["rosters"])
    elif match_boxscore.get("players"):
        roster_data = {
            "home": { "players": [] },
            "away": { "players": [] }
        }
    team_data["home"]["roster"] = roster_data["home"]
    team_data["away"]["roster"] = roster_data["away"]

    odds_prop = match_data.get("odds", match_data["pickcenter"])
    odds_data = processOddsData(odds_prop)

    match_data = {
        "date": str(datetime.datetime.fromisoformat(match_header_competitions["date"])),
        "venue": {
            "id": match_venue["id"],
            "name": match_venue.get("fullName", match_venue.get("shortName")),
            "images": match_venue.get("images", [])
        },
        "metadata": match_metadata,
        "teams": team_data,
        "odds": odds_data,
    }
    if match_officials:
        referee = "Unknown"
        for official in match_officials:
            position = official.get("position", "unknown")
            if position == "Referee":
                referee = position.get("displayName")
        if referee == "Unknown":
            referee = match_officials[0]["displayName"]
        match_data["official"] = referee

    return match_data

def upload_match_to_mongo(collection, processed_match) -> None:
    if not processed_match:
        print("No match to upload")
        return
    matchInDB = collection.find_one({"id": processed_match["id"]})
    if matchInDB:
        print("Match already in db")
        return
    collection.update_one({"id": processed_match["id"]}, {"$set":processed_match}, upsert=True)
    metadata = processed_match["metadata"]
    print(f"Finished uploading match for {metadata["sport"]} {metadata["league"]} {metadata["season"]} - {processed_match["id"]} to MongoDB")

def main():
    cwd = getcwd()
    if "team_info" in cwd:
        proj_path = path.join(cwd, "..")
    elif "backend" in cwd:
        proj_path = path.join(cwd, "..")
    else:
        proj_path = cwd
    env_path = path.join(proj_path, ".env")
    config = dotenv_values(env_path)
    env_mode = config["MODE"]
    db_name = config["MONGO_NAME"]
    if (env_mode == "prod"):
        db_user, db_password = config["MONGO_USER"], config["MONGO_PASSWORD"]
        db_host = config["MONGO_HOST"]
        db_uri = f"mongodb://{db_user}:{db_password}@{db_host}:27017/{db_name}?authSource=admin"
    else:
        db_uri = "mongodb://localhost:27017/"

    client = MongoClient(db_uri)
    db = client[db_name]
    collection = db["matches"]


    backend_dir = cwd if "backend" in cwd else path.join(cwd, "backend")
    team_info_dir = backend_dir if "team_info" in backend_dir else path.join(backend_dir, "team_info")
    api_data_path = path.join(team_info_dir, "api.data.json")
    raw_data_path = path.join(team_info_dir, "data", "raw")
    with open(api_data_path, 'r') as file:
        api_data = json.load(file)
    
    seasons_prop= api_data["seasons"]
    sports_prop = api_data["sports"]
    for sport in sports_prop:
        sport_data = sports_prop[sport]
        league_data = sport_data["leagues"]
        sport_path = path.join(raw_data_path, sport)

        for league in league_data:
            league_path = path.join(sport_path, league)
            matches_dir_path = path.join(league_path, "matches")
            seasons_dir_path = path.join(league_path, "seasons")

            for season in seasons_prop:
                season_dir_path = path.join(matches_dir_path, season)
                season_data_path = path.join(seasons_dir_path, f"{season}.json")
                season_data = read_data_from_file(season_data_path)

                scoreboard_data = processSeasonScoreboardData(season_data)
                scoreboard_data["league"] = league
                scoreboard_data["sport"] = sport
                scoreboard_data["matches"] = []

                match_files = listdir(season_dir_path)
                # match_files = []

                for match_file_name in match_files:
                    match_id = match_file_name.split(".")[0]
                    match_file_path = path.join(season_dir_path, match_file_name)
                    with open(match_file_path, 'r') as file:
                        match_data = json.load(file)
                    try:
                        formatted_match_data = processMatchData(scoreboard_data, match_data)
                    except:
                        print(f"Error formatting data - skipping {sport} {league} {season} match {match_id}")
                    if not formatted_match_data:
                        continue
                    formatted_match_data["id"] = match_id
                    upload_match_to_mongo(collection, formatted_match_data)

                # scoreboard_data_output_path = path.join(matches_dir_path, f"{season}.json")
                # write_data_to_file(scoreboard_data_output_path, scoreboard_data)


if __name__=="__main__":
    main()