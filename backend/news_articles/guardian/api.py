import requests
import json
import datetime
from os import path, getcwd


class GuardianAPI:
    def __init__(self, 
                 previous_fetch_date: datetime.datetime = None, 
                 api_key: str = "test", 
                 api_data_path: str = "api.data.json"):
        self.api_key = api_key
        self.api_data = self.read_api_data(api_data_path)
        if not previous_fetch_date:
            self.previous_fetch_date = datetime.datetime.now()
        else:
            self.previous_fetch_date = previous_fetch_date
        self.base_content_url = "https://content.guardianapis.com/search"

    def requestContent(self, query: str="", params: dict={}) -> dict:
        search = { "api-key": self.api_key, **params,  }
        if query:
            search["q"] = query
        res = requests.get(self.base_content_url, params=search)
        if (res.status_code != 200):
            print(res, res.json())
            print("Request params:",search)
            return
        data = res.json()
        data["response"]["dateFetched"] = datetime.datetime.now().isoformat()
        return data
    
    def collect_api_data(self):
        articles = {} 
        current_date = datetime.datetime.now()
        if current_date.date() <= self.previous_fetch_date.date():
            print("No Guardian data collected: Not enough time has elapsed since last fetch")
            print("Last fetch date:", self.previous_fetch_date)
            return articles
        for sport in self.api_data:
            sport_data = self.api_data[sport]
            articles = {**articles, **self.collect_sport_articles(sport_data)}
        return articles

    def collect_sport_articles(self, sport_data: dict) -> dict:
        title = sport_data["title"]
        section = sport_data["section"]
        leagues = sport_data["leagues"]
        articles = { title: {} }

        current_date = datetime.datetime.now()
        for league in leagues:
            league_tag = section + "/" + leagues[league]
            params = {
                "type": "article",
                "section": section,
                "show-elements": "image",
                "show-tags": "keyword",
                "tag": league_tag,
                "page-size": 50,
                "from-date": self.previous_fetch_date.isoformat(),
                "to-date": current_date.isoformat()
            }
            response = self.requestContent(params=params)
            if response is None:
                break
            count = min(response["response"]["total"], response["response"]["pageSize"])
            articles[title][league] = response["response"]["results"]
            print("Fetched", count, "articles for", title, league)
        return articles

    def append_data_to_file(self, file_path: str, data: dict):
        if (path.isfile(file_path)):
            file_data = self.read_data_from_file(file_path)
            if file_data:
                file_data.extend(data)
            else:
                file_data = data
        else:
            file_data = data
        with open(file_path, "a") as file:
            json.dump(file_data, file, indent=4, sort_keys=True)


    @staticmethod
    def format_article(sport: str, league: str, article_data: dict) -> dict:
        date = article_data["webPublicationDate"]
        formatted_date = datetime.datetime.fromisoformat(date)
        article = {
            "article_id": article_data["id"],
            "href": article_data["webUrl"],
            "title": article_data["webTitle"],
            "metadata": {
                "sport": sport,
                "league": league,
                "site": "The Guardian",
                "date": formatted_date.isoformat(),
                "tags": {
                    tag["id"]: tag for tag in article_data["tags"]
                }
            },
            "media": [
                {
                    elem["relation"] : [
                        {
                            "url": asset["file"],
                            "alt": asset["typeData"]["altText"],
                            "height": int(asset["typeData"]["height"]),
                            "width": int(asset["typeData"]["width"]),
                            "credit": asset["typeData"]["credit"],
                            "source": asset["typeData"]["source"],
                        } for asset in elem["assets"]
                    ]
                } for elem in article_data["elements"]
            ]
        }
        return article

    @staticmethod
    def write_data_to_file(file_path: str, data: dict):
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4, sort_keys=True)

    @staticmethod
    def read_data_from_file(file_path) -> dict:
        if (path.exists(file_path)):
            return json.loads(open(file_path, "r").read())

    @staticmethod
    def read_api_data(file_path: str) -> dict:
        if (path.exists(file_path)):
            return json.loads(open(file_path, "r").read())


def collect_sport_articles(guardian: GuardianAPI, sport_data: dict, from_dateisoformat: str) -> dict:
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
            "from-date": from_dateisoformat(),
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
        sport_data = api_data[sport]
        articles[sport] = guardian.collect_sport_articles(sport_data)
    return articles

def main():
    api_key = "test"
    api_data_path = path.join(getcwd(), "backend", "news_articles", "guardian", "api.data.json")
    guardian = GuardianAPI(api_key=api_key, api_data_path=api_data_path)
    api_data = guardian.read_api_data(api_data_path)
    data_output_file = path.join(getcwd(), "data", "guardian_articles.json")


if __name__ == "__main__":
    main()
