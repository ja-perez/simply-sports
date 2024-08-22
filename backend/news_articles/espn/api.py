import requests
import json
import datetime
from os import path, getcwd

class ESPNAPI:
    def __init__(self, 
                api_data_path: str = "api.data.json") -> None:
        self.api_data_path = api_data_path
        self.api_data = self.read_api_data(self.api_data_path)

    def update_fetch_date(self) -> None:
        with open(self.api_data_path, 'w') as file:
            self.api_data["prevFetchDate"] = datetime.datetime.now().isoformat()
            json.dump(self.api_data, file, indent=4, sort_keys=True)

    def get_sports_map(self) -> dict:
        if "sports" in self.api_data:
            return self.api_data["sports"]
        return {}

    @staticmethod
    def get_news_urls(sport: str, league: str) -> str:
        return f"https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/news"

    def request_content(self, request_url: str) -> dict:
        res = requests.get(request_url)
        if res.status_code != 200:
            print(res, res.json())
            print("Request URL:", request_url)
            return None
        data = res.json()
        self.update_fetch_date()
        return data

    def enough_elapsed_time(self) -> bool:
        if "prevFetchDate" not in self.api_data:
            prev_fetch_date = datetime.datetime.now()
            self.update_fetch_date()
            return True
        else:
            prev_fetch_date = datetime.datetime.fromisoformat(self.api_data["prevFetchDate"])
        
        current_date = datetime.datetime.now()
        elapsed_time = current_date - prev_fetch_date
        return elapsed_time.days >= 1

    def collect_api_data(self):
        if not self.enough_elapsed_time():
            print("No ESPN data collected: Not enough time has elapsed since last fetch")
            print("Last fetch date:", self.api_data["prevFetchDate"])
            return {}

        sports = self.get_sports_map()
        articles = {}
        for sport in sports:
            sport_data = sports[sport]
            articles = {**articles, **self.collect_sport_articles(sport_data)}
        return articles

    def collect_sport_articles(self, sport_data: dict) -> dict:
        title = sport_data["title"]
        sport = sport_data["sport"]
        leagues = sport_data["leagues"]
        articles = { title: {} }

        for league in leagues:
            request_url = self.get_news_urls(sport, leagues[league])
            response = self.request_content(request_url)
            if response is None:
                break
            articles[title][league] = response["articles"]
            count = len(articles[title][league])
            print(f"Fetched {count} articles for {title} {league}")
        return articles
        
    @staticmethod
    def read_api_data(file_path: str) -> dict:
        if not path.exists(file_path):
            return {}
        with open(file_path, 'r') as file:
            return json.load(file)

    @staticmethod
    def format_article(sport, league, article_data):
        date = datetime.datetime.fromisoformat(article_data["published"])
        main_props = {
            "article_id": article_data["links"]["web"]["href"],
            "href": article_data["links"]["web"]["href"],
            "title": article_data["headline"],
        }
        metadata = {
            "sport": sport,
            "league": league,
            "site": "ESPN",
            "date": date.isoformat(),
            "categories": article_data["categories"],
            "premium": article_data["premium"],
            "type": article_data["type"],
        }
        media = [
            {
                image["type"] if "type" in image else f"{image["width"]}x{image["height"]}" : {
                    "url": image["url"],
                    "alt": "" if "alt" not in image else image["alt"],
                    "caption": "" if "caption" not in image else image["caption"],
                    "name": "" if "name" not in image else image["name"],
                    "height": int(image["height"]),
                    "width": int(image["width"]),
                    "credit": "" if "credit" not in image else image["credit"],
                }
            } for image in article_data["images"] if "width" in image and "height" in image
        ]

        return {
            **main_props,
            "metadata": metadata,
            "media": media
        }

    def process_articles(self, data) -> list:
        processed_articles = []
        for sport in data:
            leagues = data[sport]
            for league in leagues:
                articles = leagues[league]
                for article_data in articles:
                    article = self.format_article(
                        sport,
                        league,
                        article_data)
                    processed_articles.append(article)
        return {i: article for i, article in enumerate(processed_articles)}
    
    def write_data_to_file(self, file_path: str, data: dict):
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4, sort_keys=True)


def main():
    cwd = getcwd()
    if "backend" not in cwd:
        cwd = path.join(cwd, "backend", "news_articles")
    elif "news_articles" not in cwd:
        cwd = path.join(cwd, "news_articles")
    api_folder_path = path.join(cwd, "espn")
    api_data_path = path.join(api_folder_path, "api.data.json")
    espn = ESPNAPI(api_data_path)
    api_data = espn.collect_api_data()
    output_file_path = path.join(api_folder_path, "response.json")
    espn.write_data_to_file(output_file_path, api_data)

    articles = espn.process_articles(api_data)
    output_file_path = path.join(api_folder_path, "articles.json")
    espn.write_data_to_file(output_file_path, articles)


if __name__ == "__main__":
    main()
