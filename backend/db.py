"""
At this point, we have collected articles from various websites and stored them
in a folder. Each website has its own folder with subfolders for each sport. The 
articles themselves are stored in a json file with its respective league as the
filename.

The structure of the articles json folder may vary depending on the website, as
there were two collection methods used, web-scapping and API calls.

All we want to do at this point is upload the data in those json files. However,
we do want to put some thought into how we store the data for querying purposes.

"""
from pymongo import MongoClient

import os
import json

CWD = os.path.dirname(os.path.abspath(__file__))
ARTICLES_FOLDER = "sports-news"
ARTICLES_DATA_FOLDER = "data"
ARTICLES_DATA_PATH = os.path.join(CWD, ARTICLES_FOLDER, ARTICLES_DATA_FOLDER)


def upload_news_articles(articles: list[{str}]):
    client = MongoClient()
    db = client["simply_sports"]
    collection = db["news_articles"]
    collection.insert_many(articles)

def upload_single_news_article(article: {str}):
    client = MongoClient()
    db = client["simply_sports"]
    collection = db["news_articles"]
    collection.insert_one(article)

def main():
    websites = {}
    for folder_name in os.listdir(ARTICLES_DATA_PATH):
        folder_name_path = os.path.join(ARTICLES_DATA_PATH, folder_name)
        if os.path.isdir(folder_name_path):
            websites[folder_name] = folder_name_path
    
    articles = []
    for website in websites:
        website_path = websites[website]
        folder_names = os.listdir(website_path)
        sports = {sport: os.path.join(website_path, sport) for sport in folder_names}
        for sport in sports:
            sport_folder_path = sports[sport]
            # print(f"Uploading {sport} news articles from {website}")
            folder_names = os.listdir(sport_folder_path)
            leagues = {league: os.path.join(sport_folder_path, league) for league in folder_names}
            for league in leagues:
                # print(f"\t{league} uploading...")
                league_file_path = leagues[league]
                league_json_data = json.load(open(league_file_path))
                articles.append(league_json_data)
    
    # upload_news_articles(articles)



if __name__ == "__main__":
    main()