import requests
from bs4 import BeautifulSoup

import json

import os

'''
Purpose: Automate the process of scraping news articles from multiple websites
and storing them in a database.

To do this we need to know the following things (list made such that items requiring 
knowledge of previous items are ranked placed below those necessary items):
(1) Website urls to scrape                                      ----> news-url.json file                  
    - Robots.txt (What we can and can't scrape)     
(2) The structure of the webpages we want to scrape                  
    - To identify news articles from say ads, comments, etc.    ----> specifications.json file (wip)
(3) The structure of the news articles themselves
    - The metadata we want to scrape from the news articles     ----> specifications.json file (wip)
(4) The database schema we want to store the metadata in        ----> specifications.json file (wip)

The website urls we plan to scrape news articles from will be stored in a json file, called
"news-urls.json". The structure of this file will be as follows:

{
    "website1": {
        "sport_type": {
            "news_type1": "url1",
            "news_type2": "url2",
            ...
        },
        ...
    },
    "website2": {
        "sport_type": {
            "news_type1": "url1",
            "news_type2": "url2",
            ...
        },
        ...
    },
    ...
}

With this format, "sport_type" is the type of sport the website covers, "news_type" is the sub-type of news
that the website categories its sports news into. For example, a website might have a "soccer" sport type
and categorize its news first by league (e.g. "premier-league", "la-liga", etc.) and then some other sub-type.


NewsScraper sole responsibility should be to take a website url and scrape
news article metadata from it, then format it in such a way that it can be
stored into a database.

The point of making the NewsScraper class is to make it easier to scrape news articles
from multiple websites. The class should be able to scrape news articles from a website
and store them in a file. The file should be named after the website and the sport type
that the website covers. The file should be stored in the "sports-news" directory.

The NewsScraper class should have the following methods:
    - __init__(self, url): The constructor should take a url as an argument and store it in an instance variable.
    - get_news(self): This method should scrape the news articles from the website and store them in an instance variable.
    - store_news_to_file(self): This method should store the news articles in a file in the "sports-news" directory.

But if this is the case, then this could all be done with multiple functions. So, what is the point of the class?
The point of making something into a class is because it makes more sense to think of the thing we're working with as
an object. So in this case, it would make more sense to think of the class not as a single NewsScraper, but as a factory
of webscrapers, in which creating a webscraper for news articles from a website is just one of the ways it can be used.

For now though, I am going to start with a functional approach and worry about abstracting out the components into a class later.
'''


def write_to_file(file_path, data):
    with open(file_path, "w", encoding='utf-8') as file:
        file.write(str(data))

def write_list_to_file(file_path, data):
    with open(file_path, "w", encoding='utf-8') as file:
        for item in data:
            file.write(str(item) + "\n")

def get_ul_in_soup(urls):
    ul_list = []
    for url in urls:
        url_path = urls[url][0]
        div_id = urls[url][1]
        page = requests.get(url)
        soup = BeautifulSoup(page.content, "html.parser")

        ul_in_body = soup.find("div", id=div_id)
        ul_url_path = url_path.replace("responses", "data")
        ul_list.append(ul_in_body)
    return ul_list

def save_raw_page(urls):
    for url in urls:
        url_path = urls[url][0]
        page = requests.get(url)
        soup = BeautifulSoup(page.content, "html.parser")
        body = soup.find("body")

        # write page html to file
        write_to_file(url_path, body.prettify())

def process_li_items(li_list):
    item_pairs = []
    for li in li_list:
        img = li.find("img")
        a_tag = li.find("a")
        if img is None or a_tag is None:
            continue
        if len(li.find_all("a")) > 1:
            a_tag = li.find("a", class_="stream-title")
        combine = BeautifulSoup(str(img) + str(a_tag), "html.parser")
        item_pairs.append(combine)
    return item_pairs

def main():
    # Load website data and urls from news-urls.json
    file_path = os.path.join("backend", "sports-news", "news-urls.json")
    file = open(file_path, "r")
    file_data = json.load(file)

    websites = [website for website in file_data]
    urls = {}
    
    print("website\t\tsport_type\tlink_type\t\turl")
    for site in websites:
        sport_types = file_data[site]
        for sport_t in sport_types:
            link_types = sport_types[sport_t]
            for link_t in link_types:
                url = link_types[link_t]["url"]
                div_id = link_types[link_t]["div-id"]
                print(site, sport_t, link_t, url, sep="\t\t")
                urls[url] = [os.path.join("backend", "sports-news", "responses", site + "-" + sport_t + "-" + link_t + ".html"),
                             div_id]

    # save_raw_page(urls)

    li_pairs = []
    for i, ul in enumerate(get_ul_in_soup(urls)):
        li_list = ul.find_all("li")
        li_items = process_li_items(li_list)
        li_items_path = os.path.join("backend", "sports-news", "data", str(i) + "_li_pairs.html")
        write_list_to_file(li_items_path, li_items)
        li_pairs.append(li_items)

    content_pairs = []
    for li_pair in li_pairs:
        for li_content in li_pair:
            img = li_content.find("img")
            a_tag = li_content.find("a")
            if img is None or a_tag is None:
                continue
            img_src = img.get("src")
            a_tag_href = a_tag.get("href")
            a_tag_text = a_tag.get_text()
            pair = img_src + "\n" + a_tag_href + "\n" + a_tag_text
            content_pairs.append(pair)
    pair_path = os.path.join("backend", "sports-news", "data", "content_pairs.html")
    write_list_to_file(pair_path, content_pairs)

if __name__ == "__main__":
     main()
