from pymongo import MongoClient, TEXT
from dotenv import dotenv_values
import os

from news_articles.guardian.api import GuardianAPI
from news_articles.espn.api import ESPNAPI


def process_api_data(api) -> None:
    content = api.fetch_sports_content()
    processed_content = api.process_sports_content(content)
    if not processed_content:
        print("No new articles to upload")
        return
    print(f"Uploading {api.__class__.__name__} articles to MongoDB")
    upload_articles_to_mongo(processed_content)


def upload_articles_to_mongo(processed_content) -> None:
    config = dotenv_values(".env")
    env_mode = config["MODE"]
    db_name = config["MONGO_NAME"]
    if (env_mode == "prod"):
        db_user, db_password = config["MONGO_USER"], config["MONGO_PASSWORD"]
        db_host = config["MONGO_HOST"]
        db_uri = f"mongodb+srv://{db_user}:{db_password}@{db_host}:27017/{db_name}?authSource=admin"
    else:
        db_uri = "mongodb://localhost:27017/"

    client = MongoClient(db_uri)
    db = client[db_name]
    collection = db["articles"]

    for sport in processed_content:
        leagues = processed_content[sport]
        for league in leagues:
            articles = leagues[league]
            insert_count = 0
            for article in articles:
                if collection.find_one({"article_id": article["article_id"]}):
                    continue
                collection.insert_one(article)
                insert_count += 1
            print(f"Inserted {insert_count} articles for {sport} - {league}")
    

def main():
    # Base file paths
    cwd = os.getcwd()
    if "backend" not in cwd:
        cwd = os.path.join(cwd, "backend", "news_articles")
    elif "news_articles" not in cwd:
        cwd = os.path.join(cwd, "news_articles")

    # Guardian API
    guardian_folder_path = os.path.join(cwd, "guardian")
    guardian_api_data_path = os.path.join(guardian_folder_path, "api.data.json")
    guardian = GuardianAPI(
        api_key="test",
        api_data_path=guardian_api_data_path)
    process_api_data(guardian)

    # ESPN API
    espn_folder_path = os.path.join(cwd, "espn")
    espn_api_data_path = os.path.join(espn_folder_path, "api.data.json")
    espn = ESPNAPI(espn_api_data_path)
    process_api_data(espn)


if __name__ == "__main__":
    main()