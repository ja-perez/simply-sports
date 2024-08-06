import requests
import json
import os

from bs4 import BeautifulSoup

def setup_output(website_name: str, folders: list[str])-> None:
    cwd = os.path.dirname(__file__)
    # create website folder
    website_folder_path = os.path.join(cwd, website_name)
    if not os.path.exists(website_folder_path):
        os.makedirs(website_folder_path)

    # create subfolders
    for folder in folders:
        subfolder_path = os.path.join(website_folder_path, folder)
        if not os.path.exists(subfolder_path):
            os.makedirs(subfolder_path)



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

    # espn urls for soccer news
    espn_urls = []
    espn_soccer_data = news_api_data["espn"]["soccer"]
    espn_news_api = espn_soccer_data["apis"]["news"]
    espn_leage_ids = espn_soccer_data["league-ids"]
    for league_id in espn_leage_ids:
        updated_url = espn_news_api.replace("~league~", league_id)
        espn_urls.append(updated_url)

if __name__ == "__main__":
    main()