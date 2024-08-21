import requests
import json
import datetime
from os import path, getcwd


class GuardianAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_content_url = "https://content.guardianapis.com/search"

    def requestContent(self, query: str="", params: dict={}) -> dict:
        search = { **params, "api_key": self.api_key }
        if query:
            search["q"] = query
        res = requests.get(self.base_content_url, params=search)
        data = res.json()
        data["response"]["dateFetched"] = datetime.datetime.now().isoformat()
        return data

def write_data_to_file(file_path: str, data: dict):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4, sort_keys=True)

def read_data_from_file(file_path) -> dict:
    if (path.exists(file_path)):
        return json.loads(open(file_path))

def append_data_to_file(file_path: str, data: dict):
    if (path.isfile(file_path)):
        file_data = read_data_from_file(file_path)
        if file_data:
            file_data.extend(data)
        else:
            file_data = data
    else:
        file_data = data
    with open(file_path, "a") as file:
        json.dump(file_data, file, indent=4, sort_keys=True)

def read_api_data(file_path: str) -> dict:
    if (path.exists(file_path)):
        return json.loads(open(file_path, "r").read())

def collect_sport_articles(guardian: GuardianAPI, sport_data: dict):
    title = sport_data["title"]
    section = sport_data["section"]
    leagues = sport_data["leagues"]
    articles = { title: {} }

    current_date = datetime.datetime.now()
    start_of_year = datetime.datetime(current_date.year, 1, 1)
    for league in leagues:
        league_tag = section + "/" + leagues[league]
        params = {
            "type": "article",
            "section": section,
            "show-elements": "image",
            "show-tags": "keyword",
            "tag": league_tag,
            "page-size": 50,
            "from-date": start_of_year.isoformat(),
            "to-date": current_date.isoformat()
        }
        response = guardian.requestContent(params=params)
        count = min(response["response"]["total"], response["response"]["pageSize"])
        articles[title][league] = response["response"]["results"]
        print("Fetched", count, "articles for", title, league)
    return articles

def collect_api_data(api_data: dict, guardian: GuardianAPI):
    articles = {}
    for sport in api_data:
        articles.extend(collect_sport_articles(guardian, api_data[sport]))
    return articles


def main():
    api_key = "test"
    guardian = GuardianAPI(api_key)
    api_data_file = path.join(getcwd(), "backend", "news_articles", "guardian", "api.data.json")
    api_data = read_api_data(api_data_file)
    data_output_file = path.join(getcwd(), "data", "guardian_articles.json")


if __name__ == "__main__":
    main()
