from pymongo import MongoClient
from dotenv import dotenv_values
import os

from news_articles.guardian.api import GuardianAPI
from news_articles.espn.api import ESPNAPI


def process_api_data(api) -> dict:
    content = api.fetch_sports_content()
    processed_content = api.process_sports_content(content)
    return processed_content


def upload_articles_to_mongo(collection, processed_content) -> None:
    if not processed_content:
        print("No articles to upload")
        return
    for sport in processed_content:
        leagues = processed_content[sport]
        for league in leagues:
            articles = leagues[league]
            insert_count = 0
            for article in articles:
                articleInDB = collection.find_one({"href": article["href"]})
                if articleInDB and articleInDB["metadata"]["date"] >= article["metadata"]["date"]:
                    continue
                collection.update_one({"article_id": article["article_id"]}, {"$set": article}, upsert=True)
                insert_count += 1
            print(f"Inserted {insert_count} articles for {sport} - {league}")
    print("Finished uploading articles to MongoDB")


def unset_field(collection, filter, field) -> None:
    # collection.update_many(filter, [{"$project": {field: 0}}])
    collection.update_many(filter, {"$unset": {field: ""}})


def update_espn_articles(collection) -> None:
    articles = collection.find({"metadata.site": "ESPN"})
    for article in articles:
        media_list = article["media"]
        media_items = {}
        for item in media_list:
            item_type = [item_cat for item_cat in item][0]
            item_data = item[item_type]
            if item_type == "stitcher":
                continue
            media_items.setdefault(item_type, []).append(item_data)
        article_id = article["_id"]
        collection.update_one({"_id": article_id}, {"$set": {"old_media": media_list, "media": media_items}})


def main():
    # .env file path
    cwd = os.getcwd()
    if "backend" in cwd:
        cwd = os.path.join(cwd, "..")
    env_path = os.path.join(cwd, ".env")
    config = dotenv_values(env_path)
    env_mode = config["MODE"]
    db_name = config["MONGO_NAME"]
    if (env_mode == "prod"):
        db_user, db_password = config["MONGO_USER"], config["MONGO_PASSWORD"]
        db_host = config["MONGO_HOST"]
        db_uri = f"mongodb://{db_user}:{db_password}@{db_host}:27017/{db_name}?authSource=admin"
    else:
        db_uri = "mongodb://localhost:27017/"

    client = MongoClient(db_uri)
    db = client[db_name]
    collection = db["articles"]

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
    processed_guardian_data = process_api_data(guardian)

    # ESPN API
    espn_folder_path = os.path.join(cwd, "espn")
    espn_api_data_path = os.path.join(espn_folder_path, "api.data.json")
    espn = ESPNAPI(espn_api_data_path)
    processed_espn_data = process_api_data(espn)

    print()

    print(f"Uploading The Guardian articles to MongoDB")
    upload_articles_to_mongo(collection, processed_guardian_data)

    print(f"Uploading ESPN articles to MongoDB")
    upload_articles_to_mongo(collection, processed_espn_data)


if __name__ == "__main__":
    main()