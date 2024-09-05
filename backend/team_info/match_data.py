import datetime
import json
from os import path, getcwd, mkdir
import requests


def fetch_match_data(url):
    res = requests.get(url)
    if res.status_code != 200:
        print(res, res.json())
        print(url)
    data = res.json()
    return data


def write_data_to_file(path, data):
    with open(path, "w") as file:
        json.dump(data,file, indent=4)


def get_match_link(sport, leagueId, matchId):
    return f"https://site.api.espn.com/apis/site/v2/sports/{sport}/{leagueId}/summary?event={matchId}"


def main():
    cwd = getcwd()
    backend_dir = cwd if "backend" in cwd else path.join(cwd, "backend")
    team_info_dir = cwd if "team_info" in backend_dir else path.join(backend_dir, "team_info")
    apiDataPath = path.join(team_info_dir, "api.data.json")
    rawDataOutputPath = path.join(team_info_dir, "data", "raw")
    with open(apiDataPath, 'r') as file:
        apiData = json.load(file)

    seasonProp = apiData["seasons"]
    sportsProp = apiData["sports"]
    for sport in sportsProp:
        sportData = sportsProp[sport]
        leagueData = sportData["leagues"]

        sportPath = path.join(rawDataOutputPath, sport)
        if not path.exists(sportPath):
            mkdir(sportPath) 

        for league in leagueData:
            leaguePath = path.join(sportPath, league)
            if not path.exists(leaguePath):
                mkdir(leaguePath) 
            seasonsPath = path.join(leaguePath, "seasons")
            if not path.exists(seasonsPath):
                mkdir(seasonsPath)
            matchesPath = path.join(leaguePath, "matches")
            if not path.exists(matchesPath):
                mkdir(matchesPath)
            
            leagueId = leagueData[league]
            for season in seasonProp:
                print(f"Collecting {sport} {league} {season} match data")
                seasonDataPath = path.join(seasonsPath, f"{season}.json")
                if not path.exists(seasonDataPath):
                    print(f"Missing raw data file for {sport} {league} {season}")
                    continue

                seasonMatchesPath = path.join(matchesPath, season)
                if not path.exists(seasonMatchesPath):
                    mkdir(seasonMatchesPath)

                with open(seasonDataPath, 'r') as file:
                    seasonData = json.load(file)
                events = seasonData["events"]
                for event in events:
                    eventId = event["id"]
                    matchAPILink = get_match_link(sport, leagueId, eventId)
                    matchDataPath = path.join(seasonMatchesPath, f"{eventId}.json")
                    if path.exists(matchDataPath):
                        print(f"\t!Error: Already collected info for {sport} {league} {season} - match {eventId}")
                    data = fetch_match_data(matchAPILink)
                    write_data_to_file(matchDataPath, data)
                    print(f"\tCollected info for {sport} {league} {season} - match {eventId}")

def processScoreboardData(scoreboardData):
    leagueSeasonId = scoreboardData["leagues"]["id"]
    leagueSeasonLogos = scoreboardData["leagues"]["logos"]
    leagueSeason = {
        "id": leagueSeasonId,
        "logos": leagueSeasonLogos,
        "standings": {}
    }
    leagueSeasonMatches = scoreboardData["event"]
    matches = []
    for match in leagueSeasonMatches:
        matchDateTime = datetime.datetime.fromisoformat(match["date"])
        matchDate = datetime.datetime.date(matchDateTime)
        matchID = match["id"]
        matchName = match["name"]
        matchVenue = match["venue"]["displayName"]
        matchCompetitors = match["competitions"]["competitors"]
        matchTeams = {}
        for teamData in matchCompetitors:
            homeAway = teamData["homeAway"]
            team = {
                "id": teamData["id"],
                "homeAway": homeAway,
                "winner": teamData["winner"],
                "score": teamData["score"],
                "name": teamData["team"]["name"],
                "abbreviation": teamData["team"]["abbreviation"],
                "logo": teamData["team"]["logo"],
            }
            matchTeams[homeAway] = team

            standings = leagueSeason["standings"].get(matchDate, {
                team["id"]: { "w": 0, "l": 0, "d": 0}
            })
            if team["winner"]:
                standings[team["id"]]["w"] += 1
            leagueSeason["standings"] = standings

        matches.append({
            "seasonId": leagueSeasonId,
            "date": matchDateTime,
            "id": matchID,
            "name": matchName,
            "venue": matchVenue,
            "teams": matchTeams,
        })

        draw = not (matchTeams["home"]["winner"] or matchTeams["away"]["winner"])
        if draw:
            leagueSeason["standings"][matchDate][matchTeams["home"]["id"]]["d"] += 1
            leagueSeason["standings"][matchDate][matchTeams["away"]["id"]]["d"] += 1
        elif matchTeams["home"]["winner"]:
            leagueSeason["standings"][matchDate][matchTeams["away"]["id"]]["l"] += 1
        else:
            leagueSeason["standings"][matchDate][matchTeams["home"]["id"]]["l"] += 1

    return {
        "matches": matches,
        "season": leagueSeason
    }

if __name__ == "__main__":
    main()