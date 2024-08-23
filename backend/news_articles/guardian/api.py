import requests
import json
import datetime
from os import path, getcwd


class GuardianAPI:
    def __init__(self,
                api_key: str = "test",
                api_data_path: str = "api.data.json"):
        self.api_key: str = api_key
        self.api_data_path: str = api_data_path
        self.api_data: dict = self.read_api_data()
        self.previous_fetch_date: datetime.datetime = self.get_fetch_date()
        self.base_content_url = "https://content.guardianapis.com/search"

    def read_api_data(self) -> dict:
        if not path.exists(self.api_data_path):
            return {}
        with open(self.api_data_path, 'r') as file:
            return json.load(file)

    def fetch_sports_content(self) -> dict:
        previous_fetch_date = self.previous_fetch_date
        current_date = datetime.datetime.now()
        if not self.has_day_passed(previous_fetch_date, current_date):
            print("No Guardian data collected: Not enough time has elapsed since last fetch")
            print("Last fetch date:", previous_fetch_date)
            return {}
            
        content = {}
        sports = self.api_data.get("sports", {})
        for sport in sports:
            sport_data = sports[sport]
            content[sport] = {}
            leagues = sport_data.get("leagues", {})
            for league in leagues:
                sport_params = {
                    "section": sport_data.get("section"),
                    "tag": "/".join([
                        sport_data.get("section"),
                        leagues[league].get("value")
                        ]),
                    "from-date": previous_fetch_date.isoformat(),
                    "to-date": current_date.isoformat()
                }
                req_params = self.get_article_params(sport_params)
                data = self.get_content(params=req_params)
                content[sport][league] = data.get("results", [])
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
                processed_articles = self.process_sport_articles(articles)
                updated_articles = []
                for article in processed_articles:
                    article["metadata"]["sport"] = sport
                    article["metadata"]["league"] = league
                    updated_articles.append(article)
                processed_content[sport][league] = updated_articles
        return processed_content

    def process_sport_articles(self, articles: list) -> list:
        processed_articles = []
        for article in articles:
            # Filtering
            image_count = sum([1 for elem in article["elements"] if elem["type"] == "image"])
            if image_count < 1:
                continue
            # Formatting
            processed_article = self.format_article(article)
            # Append to list
            processed_articles.append(processed_article)
        return processed_articles

    def format_article(self, article_data: dict) -> dict:
        content_props = {
            "article_id": article_data.get("id"),
            "href": article_data.get("webUrl"),
            "title": article_data.get("webTitle"),
        }
        metadata_props = {
            "site": "The Guardian",
            "date": article_data.get("webPublicationDate"),
            "tags": { tag["id"]: tag for tag in article_data.get("tags", []) }
        }
        media_props = {
            elem["relation"] : [
                {
                    "url": asset["file"],
                    "alt": asset["typeData"]["altText"],
                    "height": int(asset["typeData"]["height"]),
                    "width": int(asset["typeData"]["width"]),
                    "credit": asset["typeData"]["credit"],
                    "source": asset["typeData"]["source"],
                } for asset in elem.get("assets", [])
            ] for elem in article_data.get("elements", [])
        }
        return {**content_props, "metadata": metadata_props, "media": media_props}

    def get_article_params(self, params: dict) -> dict:
        return {
            "type": "article",
            "show-elements": "image",
            "show-tags": "keyword",
            "page-size": 50,
            "api-key": self.api_key,
            **params
        }

    def get_content(self, params: dict) -> dict:
        res = requests.get(self.base_content_url, params=params)
        if res.status_code != 200:
            print(res, res.json())
            print("Request params:", params)
            return {}
        data = res.json()
        return data.get("response", {})

    def update_fetch_date(self):
        self.set_fetch_date(datetime.datetime.now())

    def set_fetch_date(self, date: datetime.datetime):
        self.previous_fetch_date = date
        self.api_data["prevFetchDate"] = self.previous_fetch_date.isoformat()
        self.write_data_to_file(self.api_data_path, self.api_data)

    def get_fetch_date(self):
        if "prevFetchDate" not in self.api_data:
            return datetime.datetime.now()
        return datetime.datetime.fromisoformat(self.api_data["prevFetchDate"])

    def has_day_passed(self, previous_date: datetime.datetime, current_date: datetime.datetime) -> bool:
        return (current_date - previous_date).days >= 1

    @staticmethod
    def write_data_to_file(file_path: str, data: dict):
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4, sort_keys=True)


def main():
    cwd = getcwd()
    if "backend" not in cwd:
        cwd = path.join(cwd, "backend", "news_articles")
    if "news_articles" not in cwd:
        cwd = path.join(cwd, "news_articles")
    api_folder = path.join(cwd, "guardian")
    api_data_path = path.join(api_folder, "api.data.json")
    api = GuardianAPI(
        api_key="test",
        api_data_path=api_data_path
    )
    content = api.fetch_sports_content()
    processed_content = api.process_sports_content(content)
    output_file_path = path.join(api_folder, "articles.json")
    api.write_data_to_file(output_file_path, processed_content)

if __name__ == "__main__":
    main()