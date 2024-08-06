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

08/05/24
I decided to move forward and just settle with using the div id's. I did test out the first method for solving
the multiple "ul" tag issue and found that in my two test cases, there were actually multiple tags in both
with one appearing first and the other second... so again I've settled with just using div id's.

In processing the actual list items I thought I'd be able to just extract the first img and a tags that I found
but in some articles, the img itself is wrapped in an a tag, so I just added a quick check to see if there are multiple
a tags, and if so then extract the one with a specific class name. Not ideal and will require an additional property in
the url json file for each url for an a tag identifier in the case of conflicts.

Overall though, extracting the img source, a tag text and href was relatively straightforward. I know have a text file full
of news article metadata.

Next step would be to clean up the code and either remove all the preliminary testing and logging or refactor it and move it
into some kind of testing module. I'll also have to start looking for more websites with sports articles and see if my current
process holds up for them as well. I've already considered ESPN but I found a leetcode post saying that its content is dynamically
generated so I might have to use something called selenium, or make calls directly to the api. I'm not sure yet if that applies to
the news articles that I plan to scrape but we will see when I get there.

I actually already ran into a similar problem with the Yahoo Premier League website, in that the page the is returned by the request
method doesn't include the entire list of articles, only about 3 or 5. When I inspect the page directly the DOM tree has all of them
there so I believe its because only those 3 or 5 are generated first while the rest are delayed. It is a really long list so I could
see that being the case, but some quick google searching make me believe I might have to use the stream option in requests, but again
I'm not too sure at this point.

08/06/24
Previously I mentioned that I intended to collect news articles from ESPN using the webscraper, but I immediately found out that isn't
possible anymore as any "robotic" call gets a 403 error, which indicates that the request was recieved and correct but not accepted.
So after some digging I came across multiple github repos and general discussion posts about ESPNs hidden apis, one of which contains
news information, so that was the new approach I had to take.

Implementing the news-by-api script was miles easier than the webscraping script, of course because all of the data I collect is formatted
and "consistent" with the assumption that it be used for the exact purpose that I am using it. So it really just turned into a process
where I can just turn the response into a json object and extract/copy what I needed to my own object where I can ultimately save it into
a file.

I did realize I may run into a problem later with how I'm organizing all the data, in that I have a directory that starts with the website
name, then goes into the sports, which is then filled with json files for that sports respective leagues. It's not really a problem, more of
a question if the way I organize the files will become a problem given a certain number of websites or sports. Essentially I'm wondering
if it would be better to have sports as the root directory and then websites, or keep it the way I have it which is the opposite. Granted
the reason I have it the way I do is because thats the way I organized it in the news-apis.json file, where the first property is websites,
then sports, and finally the rest of the stuff I need to create the api urls.

When I imagine how the news page is going to look, I figured each sport would have its own page with the news articles and the website that they
were pulled from, filling a horizontal div or container. So in this case, when designing the logic for how to pull the data, it would be easier
if I had all of the soccer articles in one place, with each website containing its respective leagues articles.

Technically this shouldn't really matter as I intend to move all of the data to a database, where querying for a specific type of data should
be relatively simple. But, if its the case that thats only really possible with the right schema, then I'll need to keep that in mind when
creating and designing the database calls.

With that being said, now that I have a sizable amount of data collected, I should be good to start working on a script for uploading the
data to a database. After that, I'll be able to move back to the front end and work on a design for making all of the different articles
look good.