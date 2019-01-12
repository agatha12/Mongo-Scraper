var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models/Article");
var db2 = require("./models/Saved")
var db3 = require("./models/Note")






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
    const id = req.params.id
    db.findOne({ _id: id })
      // ..and populate all of the notes associated with it
      .then(function(dbArticle) {
       
        // var status = function (title){
        //   var status = false
        //   db2.findOne({ title: title }).then(function(res, err){
        //     console.log(res)
        //     if(res.title = "hj"){
        //       status = true
        //     }
        //   })
        //   console.log(status)
        //   return status
          
        // }
        // console.log(status(title))
        
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

  app.get("/saved", function(req, res){

    res.render("saved")

});

  app.get("/savedarticles", function(req, res) {
    // Grab every document in the Articles collection
    db2.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.delete("/delsaved/:id", function(req, res){
    var id = req.params.id
    console.log(id)
    db2.findByIdAndRemove(id, function(){
    })
    res.render("saved")
      
    
    
})

app.delete("/clearsaved", function(req, res){

  db2.deleteMany({}, function (err) {});
  
})


app.post("/articles/:id", function(req, res) {
  console.log(req.body)
  db3.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db2.findOneAndModify({ _id: req.params.id }, { note: dbNote._id }, {upsert: true}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.get("/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db3.find({ articleId: req.params.id })
    // ..and populate all of the notes associated with it
    .then(function(dbNote) {
      console.log(dbNote)
      // var newsave = {
      //   title: dbNote.title,
      //   note: dbNote.body,
      //   articleId: dbNote.article_Id
      // }
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbNote)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.delete("/delnote/:id", function(req, res){
  var id = req.params.id
  console.log(id)
  db3.findByIdAndRemove(id, function(){
  })
  res.render("saved")
    
  
  
})

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});