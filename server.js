var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models/Article");

var db2 = require("./models/Saved")






var PORT = 3000;


var app = express();




app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


mongoose.connect("mongodb://localhost/mongoscraper", { useNewUrlParser: true });

// Routes

app.get("/", function(req, res){

    res.render("scraper")

});


app.get("/scrape", function(req, res) {
  
  axios.get("https://www.npr.org/sections/news/").then(function(response) {
    
    var $ = cheerio.load(response.data);

    
    $("article").each(function(i, element) {
      
      var articles = {};

      
      articles.title = $(element).children(".item-info").children("h2").children("a").text();
      articles.link = $(element).children(".item-info").children("h2").children("a").attr("href");
      articles.description = $(element).children(".item-info").children("p").children("a").text();
        // console.log(articles)
      
      db.create(articles)
        .then(function(dbArticle) {
          
          console.log(dbArticle);
        })
        .catch(function(err) {
          
          console.log(err);
        });
    });

      

    
    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .then(function(dbArticle) {
        console.log(dbArticle)
        var newsave = {
          title: dbArticle.title,
          link: dbArticle.link,
          description: dbArticle.description
        }
        db2.create(newsave)
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

app.delete("/clear", function(req, res){

    db.deleteMany({}, function (err) {});
    
})




app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});