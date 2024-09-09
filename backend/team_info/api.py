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

def processEventData(events):
    data = {
        "matches": {},
        "standings": {},
        "team_names": {},
    }
    for event in events:
        # Match date
        # Note: var naming convention is: [source or property]_[value]_[format or none if obvious or built-in type]
        event_datetime_iso = event["date"]
        event_datetime_datetime = datetime.datetime.fromisoformat(event_datetime_iso)
        event_date_datetime = event_datetime_datetime.date()

        date_standings = data["standings"].get(str(event_date_datetime), {})

        # Team Names
        competitors = event["competitions"][0]["competitors"]
        draws_possible = False
        for competitor in competitors:
            team_data = competitor["team"]
            team_id = team_data["id"]

            team_name = team_data.get("name") if team_data.get("name") else team_data.get("shortDisplayName")
            team_abbreviation = team_data["abbreviation"]
            team_displayName = team_data["displayName"]
            if team_id not in data["team_names"]:
                data["team_names"][team_id] = {
                    "name": team_name,
                    "abbreviation": team_abbreviation,
                    "displayName": team_displayName
                }

            try:
                team_record = competitor["records"][0]["summary"].split("-")
            except KeyError as _:
                print(f"!Error processing competitor {team_id} for event {event["id"]}")
                continue
            wins = team_record[0]
            losses = team_record[-1]
            date_standings[team_id] = {
                "w": int(wins), "l": int(losses), "team": data["team_names"][team_id]
            }
            draws = team_record[1] if len(team_record) == 3 else -1
            if draws != -1:
                draws_possible = True
                date_standings[team_id]["d"] = int(draws)

            data["standings"][str(event_date_datetime)] = date_standings



        match_id = event["id"]
        match_season = event["season"]
        data["matches"][match_id] = {
            "label": event["name"],
            "shortName": event["shortName"],
            "seasonId": match_season["slug"],
        }

    standing_dates = [datetime.datetime.fromisoformat(date) for date in data["standings"]]
    sorted_dates = sorted(standing_dates)
    prev_records = {}
    for date in sorted_dates:
        standing = data["standings"][str(date.date())]
        for team_id in data["team_names"]:
            team_data = data["team_names"][team_id]
            if team_id not in standing:
                initial_vals = {"w": 0, "l": 0, "d": 0, "team": team_data} if draws_possible else {"w": 0, "l":0, "team": team_data}
                prev_rec = prev_records.get(team_id, initial_vals)
                data["standings"][str(date.date())][team_id] = prev_rec

    return data


def processSeasonScoreboardData(data):
    league_prop = data["leagues"][0]

    events = data["events"]
    match_data = processEventData(events)
    return {
        "logos": league_prop["logos"],
        "teams": match_data["team_names"],
        "standings": match_data["standings"],
        "matches": match_data["matches"]
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
            "name": team_data.get("name", team_data.get("displayName")),
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
    try:
        match_boxscore = match_data["boxscore"]
        match_header = match_data["header"]
        match_gameinfo = match_data["gameInfo"]

        match_header_competitions = match_header["competitions"][0]
        match_header_competitors = match_header_competitions["competitors"]
        match_venue = match_gameinfo["venue"]
        match_officials = match_gameinfo.get("officials", [])
    except KeyError as e:
        print(f"!Error: Match {match_data["id"]} missing key properties for processing")
        return {}

    match_complete = match_header_competitions["status"]["type"]["completed"]
    if not match_complete:
        print(f"!Error: Match {match_data["id"]} was not completed")
        return {}

    match_season_data = match_header["season"]
    match_league_data = match_header["league"]
    match_metadata = {
        "sport": season_data["sport"],
        "league": match_league_data["name"],
        "season": match_season_data.get("name", season_data["matches"][match_data["id"]]["seasonId"]),
        "seasonYear": match_season_data["year"],
        "seasonId": season_data["matches"][match_data["id"]]["seasonId"],
    }

    team_data = processTeamData(match_header_competitors)
    roster_data = {}
    if match_data.get("rosters"):
        try:
            roster_data = processRosterData(match_data["rosters"])
        except:
            roster_data = {
            "home": { "players": [] },
            "away": { "players": [] }
            }
    elif match_boxscore.get("players"):
        roster_data = {
            "home": { "players": [] },
            "away": { "players": [] }
        }
    team_data["home"]["roster"] = roster_data["home"]
    team_data["away"]["roster"] = roster_data["away"]

    odds_prop = match_data.get("odds", match_data["pickcenter"])
    odds_data = processOddsData(odds_prop)

    match_datetime = datetime.datetime.fromisoformat(match_header_competitions["date"])
    match_date = match_datetime.date()
    try:
        match_standings = season_data["standings"][str(match_data)]
    except KeyError as _:
        print(f"!Error: No matching standings for {match_data["id"]}")
        return {}

    match_data = {
        "id": match_data["id"],
        "label": season_data["matches"][match_data["id"]]["label"],
        "shortName": season_data["matches"][match_data["id"]]["shortName"],
        "date": match_header_competitions["date"],
        "venue": {
            "id": match_venue["id"],
            "name": match_venue.get("fullName", match_venue.get("shortName")),
            "images": match_venue.get("images", [])
        },
        "metadata": match_metadata,
        "teams": team_data,
        "odds": odds_data,
        "standings": season_data["standings"][str(match_date)]
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

                match_files = listdir(season_dir_path)

                for match_file_name in match_files:
                    match_id = match_file_name.split(".")[0]
                    match_file_path = path.join(season_dir_path, match_file_name)
                    with open(match_file_path, 'r') as file:
                        match_data = json.load(file)
                    match_data["id"] = match_id
                    formatted_match_data = processMatchData(scoreboard_data, match_data)
                    if not formatted_match_data:
                        print(f"Error formatting data - skipping {sport} {league} {season} match {match_id}")
                        continue
                    upload_match_to_mongo(collection, formatted_match_data)

                # scoreboard_data_output_path = path.join(matches_dir_path, f"{season}.json")
                # write_data_to_file(scoreboard_data_output_path, scoreboard_data)


if __name__=="__main__":
    main()


