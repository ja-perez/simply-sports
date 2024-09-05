import json
from os import path, getcwd, mkdir
import requests


def write_data_to_file(path, data):
    with open(path, "w") as file:
        json.dump(data,file, indent=4)


def get_season_link(sport, leagueId, seasonType, year):
    return f"https://site.api.espn.com/apis/site/v2/sports/{sport}/{leagueId}/scoreboard?seasontype={seasonType}&dates={year}"


def fetch_season_data(url):
    res = requests.get(url)
    if res.status_code != 200:
        print(res, res.json())
        print(url)
    data = res.json()
    return data


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
        regularSeasonType = sportData["seasonTypes"]["regular"]

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
            print(f"displaying {sport} {league} season links")
            for season in seasonProp:
                seasonMatchesPath = path.join(matchesPath, season)
                if not path.exists(seasonMatchesPath):
                    mkdir(seasonMatchesPath)

                seasonDataPath = path.join(seasonsPath, f"{season}.json")
                if path.exists(seasonDataPath):
                    print(f"Season {season} data has already been collected")
                    continue

                seasonAPILink = get_season_link(sport, leagueId, regularSeasonType, season)
                print(f"{season}\t{seasonAPILink}")
                data = fetch_season_data(seasonAPILink)
                num_of_matches = len(data["events"])
                data["matchCount"] = num_of_matches

                write_data_to_file(seasonDataPath, data)


if __name__=="__main__":
    main()