# Mongo-Scraper


Mongo Scraper is an app designered to scraper the National Public Raido's news website and display An image, title, link, and brief description of each article. It also allows users to save articles and make notes on them. 

The app uses axios and cheerio to make a call to "scrape" the National Public Radios news website and bring back all of the html. It then uses jQuery to parse through that html and create and object with the title, image, link and a brief description for each article and saves that information in a Mongo database.

Handelbars is used to render the saved and scrape pages. An AJAX call is then made to the server which brings back the data for each article and displays them on the page using jQueary. 

On the scraped page each article has a "save artcile" button, when it is clicked the article will be saved into a seperate collection in the database. Users can also click a "clear" button to delete all articles from the scraped collection. The articles will dissapear from page. Finally the "scrape" button will delete all of the old articles from the page and scrape the Nation Pubicl Radios News website for new articles which will then be displayed. 

On the saved page each article has a "delete article" button which will delete the article from the saved collection and take it off of the page. Each article also has a "notes" button. When it is clicked a modal is toggeled. This modal displays notes about this article that have been saved in a seperate collecion. It also allows users to delete notes and write new notes. There is also a "clear" button on the saved page which allows users to clear all saved articles.

https://arcane-reef-94155.herokuapp.com/