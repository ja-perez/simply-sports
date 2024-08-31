import requests
import json
import datetime
from os import path, getcwd

class ESPNAPI:
    def __init__(self, 
                api_data_path: str = "api.data.json") -> None:
        self.api_data_path: str = api_data_path
        self.api_data = self.read_api_data()
        self.previous_fetch_date: datetime.datetime = self.get_fetch_date()

    def read_api_data(self) -> dict:
        if not path.exists(self.api_data_path):
            return {}
        with open(self.api_data_path, 'r') as file:
            return json.load(file)

    def fetch_sports_content(self) -> dict:
        previous_fetch_date = self.previous_fetch_date
        current_date = datetime.datetime.now()
        if not self.has_day_passed(previous_fetch_date, current_date):
            print("No ESPN data collected: Not enough time has elapsed since last fetch")
            print("Last fetch date:", self.api_data["prevFetchDate"])
            return {}

        content = {}
        sports = self.api_data.get("sports", {})
        print(f"Fetching articles from ESPN API")
        for sport in sports:
            sport_data = sports[sport]
            content[sport] = {}
            leagues = sport_data.get("leagues", {})
            for league in leagues:
                league_id = leagues[league].get("value")
                news_url = self.get_news_url(sport, league_id)
                data = self.get_content(url=news_url)
                content[sport][league] = data.get("articles", [])
                print(f"Fetched {len(content[sport][league])} articles for {sport} {league}")
        self.update_fetch_date()
        return content

    def process_sports_content(self, content: dict) -> dict:
        processed_content = {}
        for sport in content:
            sport_data = content[sport]
            processed_content[sport] = {}
            for league in sport_data:
                articles = sport_data[league]
                processed_content[sport][league] = self.process_sport_articles(articles)
                updated_articles = []
                for article in processed_content[sport][league]:
                    article["metadata"]["sport"] = sport
                    article["metadata"]["league"] = league
                    updated_articles.append(article)
                processed_content[sport][league] = updated_articles
        return processed_content

    def process_sport_articles(self, articles: list) -> list:
        processed_articles = []
        for article in articles:
            # Filtering
            if not article.get("images"):
                continue
            # Formatting
            processed_article = self.format_article(article)
            # Append to list
            processed_articles.append(processed_article)
        return processed_articles

    def format_article(self, article_data: dict) -> dict:
        content = {
            "article_id": article_data["links"]["web"]["href"],
            "title": article_data["headline"],
            "href": article_data["links"]["web"]["href"],
        }
        metadata = {
            "site": "ESPN",
            "date": article_data["published"],
            "categories": [cat for cat in article_data.get("categories", []) if cat.get("type") != "guid"],
            "premium": article_data.get("premium"),
            "type": article_data.get("type"),
        }
        images = [image for image in article_data.get("images", []) 
                  if image.get("type") != "stitcher" and "width" in image and "height" in image]
        media_types = set([image.get("type", f"{image['width']}x{image['height']}") for image in images])
        media = {
            media_type: [
                {
                    "url": image["url"],
                    "alt": image.get("alt", ""),
                    "caption": image.get("caption", ""),
                    "name": image.get("name", ""),
                    "height": int(image["height"]),
                    "width": int(image["width"]),
                    "credit": image.get("credit", ""),

                } for image in images if image.get("type", f"{image['width']}x{image['height']}") == media_type
            ] for media_type in media_types
        }
        return {**content, "metadata": metadata, "media": media}

    def get_content(self, url: str, params: dict = {}) -> dict:
        res= requests.get(url, params=params)
        if res.status_code != 200:
            print(res, res.json())
            print("Request url:", url)
            return {} 
        data = res.json()
        return data

    def update_fetch_date(self) -> None:
        start_of_day = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        self.set_fetch_date(start_of_day)

    def set_fetch_date(self, date: datetime.datetime) -> None:
        self.previous_fetch_date = date
        self.api_data["prevFetchDate"] = self.previous_fetch_date.isoformat()
        self.write_data_to_file(self.api_data_path, self.api_data)

    def get_fetch_date(self) -> datetime.datetime:
        if "prevFetchDate" not in self.api_data:
            return datetime.datetime.now()
        return datetime.datetime.fromisoformat(self.api_data["prevFetchDate"])
    
    def has_day_passed(self, previous_date: datetime.datetime, current_date: datetime.datetime) -> bool:
        return (current_date - previous_date).days >= 1

    @staticmethod
    def get_news_url(sport: str, league: str) -> str:
        return f"https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/news"

    @staticmethod
    def write_data_to_file(file_path: str, data: dict):
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
    content = espn.fetch_sports_content()
    output_file_path = path.join(api_folder_path, "response.json")
    espn.write_data_to_file(output_file_path, content)

    processed_content = espn.process_sports_content(content)
    output_file_path = path.join(api_folder_path, "articles.json")
    espn.write_data_to_file(output_file_path, processed_content)


if __name__ == "__main__":
    main()
