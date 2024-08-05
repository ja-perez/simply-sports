# Sports News
This directory contains all of the scripts and specifications necessary to
collect online sports articles from various sources, to be showcased on
the Simply-Sports website.

At the point of writing this, web scraping is the method being used to accomplish the previous goal.
I will attempt to document my progress and obstacles faced in the hopes that others main benefit
from it.

08/04/24:
Progress on scraping the Yahoo websites soccer news. Scraping the website itself is almost always the
easy part, thanks to BeautifulSoup. The hard part is processing the massive tree of HTML tags to find
the exact information you're looking for.
The most ideal case of course, would be for the list of news articles have a uniform ID across the website
indicating that it was full of news articles. i.e.:

```html
<!-- If viewing sports.yahoo.com/soccer/premier-league/ -->
<ul id="premier-league-news-articles"> 
    <li> Article 1 </li>
    <li> Article 2 </li>
    ...
</ul>
```
That is unfortunately **not** how the DOM tree is loaded, thus I resorted to trial-and-error for figuring
out how Yahoo organizes their news articles.

The second most ideal case would be that the DOM structure be consistent in where the news articles are
placed. First I found that all articles can be found in a div with the id="Main".

```
As a note: Some brute force methods that came to mind included just filtering out all of the "a" and "img" tags, however the amount of unrelated tags would require such an insane amount of processing that even reducing the search space to just the "Main" div doesn't give us enough context.
```

Next, using this reduced scope, I figured the only other consistent pattern I could apply was looking for 
all "ul" tags and eventually process each item. However I ran into an issue where a list of navigation links
appeared before the articles list. 

One possible way for me to deal with this would be to explore ALL of the "Main" divs on Yahoo and see if it
is always the case that when a list is present in the div, the article list is always the last or second or
whatever other pattern I can find.

The alternative to all of this of course, is to simply go through each webpage with relevant articles and
copying and pasting the id of the lists parent div. I'm not too sure if those ids are generated randomly or
if Yahoo uses an actual naming convention, but because its an id I'm inclined to believe its not something that gets changed.
