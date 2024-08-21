from dotenv import dotenv_values
from os import getcwd, path
import requests
import json
import datetime
import backend.news_articles.guardian.utils as utils

CWD = getcwd()
ENV_PATH = path.join(CWD, ".env")


soccer_query = "(football OR soccer OR Football OR Soccer) AND NOT (NFL OR nfl OR flag football OR Flag football OR Flag Football)"

def fetch_articles(query=None, from_date=None, to_date=None, write_to_file=False):
    # config = dotenv_values(ENV_PATH)
    # api_key = config["GUARDIAN_API_KEY"]
    api_key = "test"
    base_url = "https://content.guardianapis.com/search"
    params = {
        "api-key": api_key,
        "type": "article",
        "section": "sport",
        "show-elements": "image",
        "show-tags": "all"
    }
    if from_date and to_date:
        params["from-date"] = from_date
        params["to-date"] = to_date
    search = { **params, "q": query } if query else params
    res = requests.get(base_url, params=search)
    data = res.json()
    data["response"]["dateFetched"] = datetime.datetime.now().isoformat()
    if write_to_file:
        write_data_to_file(path.join(CWD, "guardian_data.json"), data)
    return data

def get_new_articles() -> dict:
    prev_date_fetched = None
    if (path.exists(path.join(CWD, "guardian_data.json"))):
        prev_data = json.loads(open(path.join(CWD, "guardian_data.json"), "r").read())
        prev_date_fetched = datetime.datetime.fromisoformat(prev_data["response"]["dateFetched"])

    current_date = datetime.datetime.now()
    data = {}

    if not prev_date_fetched:
        fetch_articles(soccer_query)
    elif current_date.date() == prev_date_fetched.date():
        print("No data fetched: Last fetch was today at", prev_date_fetched.isoformat())
        return data
    elif current_date.date() > prev_date_fetched.date():
        data = fetch_articles(soccer_query, prev_date_fetched.isoformat(), current_date.isoformat())
        return data
    else:
        print("No data fetched: Something went wrong when validating fetch dates")
        return data

def format_article(article: dict) -> dict:
    return {
        "id": article["id"],
        "title": article["webTitle"],
        "images": [
            elem for elem in article["elements"] if elem["type"] == "image"
        ],
        "href": article["webUrl"],
        "metadata": {
            "site": "The Guardian",
            "sport": "Soccer",
            "date": article["webPublicationDate"]
        },
        "tags": [
            tag for tag in article["tags"] if tag["type"] == "keyword"
        ],
    }

def main():
    data = get_new_articles()
    if not data:
        data = utils.read_json_from_file(path.join(CWD, "guardian_data.json"))
    results = data["response"]["results"]
    utils.write_json_to_file(path.join(CWD, "guardian_articles.json"), results)
    articles = []
    for result in results:
        article = format_article(result)
        articles.append(article)
    # write_data_to_file(path.join(CWD, "articles.json"), articles)


if __name__ == "__main__":
    main()