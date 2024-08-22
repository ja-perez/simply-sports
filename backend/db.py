from pymongo import MongoClient, TEXT
from dotenv import dotenv_values

import datetime
import os

from news_articles.guardian.api import GuardianAPI
from news_articles.espn.api import ESPNAPI


def insert_articles(collection, articles: list):
    for article in articles:
        collection.insert_one(article.to_dict())


def main():
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

    # Guardian API
    cwd = os.getcwd()
    if "backend" not in cwd:
        cwd = os.path.join(cwd, "backend", "news_articles")
    elif "news_articles" not in cwd:
        cwd = os.path.join(cwd, "news_articles")
    guardian_folder_path = os.path.join(cwd, "guardian")
    guardian_api_data_path = os.path.join(guardian_folder_path, "api.data.json")
    current_date = datetime.datetime.now()
    guardian = GuardianAPI(
        previous_fetch_date=current_date,
        api_data_path=guardian_api_data_path)
    sports = guardian.collect_api_data()

    for sport in sports:
        leagues = sports[sport] 
        for league in leagues:
            articles = leagues[league]
            for article_data in articles:
                article = guardian.format_article(
                    sport, 
                    league,
                    article_data)
                if collection.find_one({"article_id": article["article_id"]}):
                    continue
                collection.insert_one(article)

    # ESPN API
    espn_folder_path = os.path.join(cwd, "espn")
    espn_api_data_path = os.path.join(espn_folder_path, "api.data.json")
    espn = ESPNAPI(espn_api_data_path)

    api_data = espn.collect_api_data()
    articles = espn.process_articles(api_data)
    output_file_path = os.path.join(espn_folder_path, "articles.json")
    espn.write_data_to_file(output_file_path, articles)
    # upload articles
    for index in articles:
        article = articles[index]
        if collection.find_one({"article_id": article["article_id"]}):
            continue
        collection.insert_one(article)

if __name__ == "__main__":
    main()