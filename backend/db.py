from pymongo import MongoClient, TEXT
import pprint
from dotenv import dotenv_values

import datetime
import os
import json

from news_articles.guardian.api import GuardianAPI


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
    info = collection.index_information()
    index_pairs = [info[key]['key'][0] for key in info]
    index_names = [name for name, _ in index_pairs]
    if 'article_id' not in index_names:
        collection.create_index([("article_id")], unique=True)

    # Get newest article date from each unique source in database
    query = collection.aggregate([
        { "$group": {
                "_id": "$metadata.site",
                "newest_date": {"$max": "$metadata.date"}
            },
        },
    ])
    most_recent_article_per_source = { 
        pair['_id']: pair['newest_date'].date() for pair in query
    }


    # Guardian API
    cwd = os.getcwd() if "backend" in os.getcwd() else os.path.join(os.getcwd(), "backend")
    guardian_folder_path = os.path.join(cwd, "news_articles", "guardian")
    guardian_api_data_path = os.path.join(guardian_folder_path, "api.data.json")
    guardian = GuardianAPI(
        previous_fetch_date=most_recent_article_per_source['The Guardian'],
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
                collection.insert_one(article)


if __name__ == "__main__":
    main()