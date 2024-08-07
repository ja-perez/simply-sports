import requests
import json
import os
from datetime import datetime

def write_json_to_file(data: dict, file_path: str) -> None:
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)

def setup_output(website_name: str, folders: list[str])-> None:
    cwd = os.path.dirname(__file__)
    base_dir = os.path.join(cwd, "data")
    # create website folder
    website_folder_path = os.path.join(base_dir, website_name)
    if not os.path.exists(website_folder_path):
        os.makedirs(website_folder_path)

    # create subfolders
    for folder in folders:
        subfolder_path = os.path.join(website_folder_path, folder)
        if not os.path.exists(subfolder_path):
            os.makedirs(subfolder_path)

def process_articles(articles: list[dict]) -> dict:
    processed_articles = {}
    for i, article in enumerate(articles):
        id = f"article-{i}"
        try:
            byline = article["byline"]
        except KeyError:
            byline = "ESPN Media Staff"
        metadata = {
            "headline": article["headline"],
            "description": article["description"],
            "links": article["links"],
            "images": article["images"],
            "published": article["published"],
            "lastModified": article["lastModified"],
            "premium": article["premium"],
            "byline": byline,
            "type": article["type"],
        }
        processed_articles[id] = metadata
    return processed_articles

def get_espn_soccer_data(news_api_data):
    # espn urls for soccer news
    espn_soccer_data = news_api_data["espn"]["soccer"]
    espn_news_api = espn_soccer_data["apis"]["news"]
    espn_leage_ids = espn_soccer_data["league-ids"]
    for league in espn_leage_ids:
        league_id = espn_leage_ids[league]
        updated_url = espn_news_api.replace("~league~", league_id)

        # get data from espn api
        response = requests.get(updated_url)
        if response.status_code != 200:
            print(f"Error {response.status_code}: Failed to get data for {league}")
            continue
        data = response.json()

        data_output_dir = os.path.join(os.path.dirname(__file__), "espn", "soccer")
        data_dir = os.path.join(data_output_dir, f"raw-{league}.json")

        # write raw response to file for testing purposes
        # write_json_to_file(data, data_dir)

        # create metadata for news
        try:
            header = data["header"]
        except KeyError:
            header = f"{league} News"
        news_metadata = {
            "header": header,
            "source": updated_url,
            "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "articles": {}
        }

        articles = data["articles"]
        article_data_path = os.path.join(data_output_dir, f"{league}.json")
        for i, article in enumerate(articles):
            id = f"article-{i}"
            try:
                byline = article["byline"]
            except KeyError:
                byline = "ESPN Media Staff"
            metadata = {
                "headline": article["headline"],
                "description": article["description"],
                "links": article["links"],
                "images": article["images"],
                "published": article["published"],
                "lastModified": article["lastModified"],
                "premium": article["premium"],
                "byline": byline,
                "type": article["type"],
            }
            news_metadata["articles"][id] = metadata

        write_json_to_file(news_metadata, article_data_path)

def test():
    league = "premier-league"
    league_id = "eng.1"
    source = f"http://site.api.espn.com/apis/site/v2/sports/soccer/{league_id}/news"

    response = requests.get(source)
    data = response.json()
    data_dir = os.path.join(os.path.dirname(__file__), "espn", "soccer")
    news_metadata = {
        "header": data["header"],
        "source": source,
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "articles": {}
    }

    articles = data["articles"]
    article_data_path = os.path.join(data_dir, f"{league}.json")
    for i, article in enumerate(articles):
        id = f"article-{i}"
        try:
            byline = article["byline"]
        except KeyError:
            byline = "ESPN Media Staff"
        metadata = {
            "headline": article["headline"],
            "description": article["description"],
            "links": article["links"],
            "images": article["images"],
            "published": article["published"],
            "lastModified": article["lastModified"],
            "premium": article["premium"],
            "byline": byline,
            "type": article["type"],
        }
        news_metadata["articles"][id] = metadata

    write_json_to_file(news_metadata, article_data_path)


def main():
    # news apis json file path
    news_apis_file_path = os.path.join(os.path.dirname(__file__), "news-apis.json")
    file = open(news_apis_file_path, "r")
    news_api_data = json.load(file)
    file.close()

    # setup output folders for each website
    for website in news_api_data:
        sports = [sport for sport in news_api_data[website]]
        setup_output(website, sports)

    # urls for each websites sports news
    for website in news_api_data:
        sports = news_api_data[website]
        for sport in sports:
            sport_data = sports[sport]
            news_api = sport_data["apis"]["news"]
            sport_league_ids = sport_data["league-ids"]
            for league in sport_league_ids:
                league_id = sport_league_ids[league]
                league_api_url = news_api.replace("~league~", league_id)

                response = requests.get(league_api_url)
                if response.status_code != 200:
                    print(f"Error {response.status_code}: Failed to get data for {league}")
                    continue
                data = response.json()
                output_dir = os.path.join(os.path.dirname(__file__), "data", website, sport)
                news_data_path = os.path.join(output_dir, f"{league}.json")

                # create metadata for news
                try:
                    header = data["header"]
                except KeyError:
                    header = f"{league} News"
                news_metadata = {
                    "header": header,
                    "source": league_api_url,
                    "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "articles": process_articles(data["articles"])
                }
                write_json_to_file(news_metadata, news_data_path)
    return 


if __name__ == "__main__":
    main()