from pymongo import MongoClient
from dotenv import dotenv_values

import datetime
import os
import json

class Article:
    def __init__(self, props: dict):
        self.validate_props(props)
        self.id = props["id"]
        self.title = props["title"]
        self.url = props["url"]
        self.date = datetime.datetime.fromisoformat(props["date"])
        self.metadata = props["metadata"]
        self.media = props["media"]

    @staticmethod
    def validate_props(props):
        required_props = [
            "id", 
            "title", 
            "url", 
            "date", 
            "metadata",
            "media"
            ]
        for prop in required_props:
            if prop not in props:
                raise ValueError(f"Article is missing required property: {prop}")

    def to_dict(self):
        return self.props

    def to_json(self):
        return json.dumps(self.to_dict())


def main():
    config = dotenv_values(".env")
    env_mode = config["MODE"]
    db_name = config["DB_NAME"]
    if (env_mode == "prod"):
        db_user, db_password = config["DB_USER"], config["DB_PASSWORD"]
        db_host = config["DB_HOST"]
        db_uri = f"mongodb+srv://{db_user}:{db_password}@{db_host}:27017/{db_name}?authSource=admin"
    else:
        db_uri = "mongodb://localhost:27017/"

    client = MongoClient(db_uri)
    db = client[db_name]
    collection = db["articles"]

    # Get newest article date from each unique source in database

    # Get articles somehow here somehow

    # Insert articles into MongoDB here



if __name__ == "__main__":
    main()