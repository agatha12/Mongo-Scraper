var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models/Article");
var db2 = require("./models/Saved")
var db3 = require("./models/Note")






var PORT = process.env.PORT || 3000;


var app = express();




app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


mongoose.connect("mongodb://localhost/mongoscraper", { useNewUrlParser: true });

// Routes

app.get("/", function (req, res) {

  res.render("scraper")

});


app.get("/scrape", function (req, res) {

  axios.get("https://www.npr.org/sections/news/").then(function (response) {

    var $ = cheerio.load(response.data);


    $("article").each(function (i, element) {

      var articles = {};


      articles.title = $(element).children(".item-info").children("h2").children("a").text();
      articles.link = $(element).children(".item-info").children("h2").children("a").attr("href");
      articles.description = $(element).children(".item-info").children("p").children("a").text();
      articles.image = $(element).children(".item-image").children(".imagewrap").children("a").children("img").attr("src");



      db.create(articles)
        .then(function (dbArticle) {

          console.log(dbArticle);
        })
        .catch(function (err) {

          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function (req, res) {

  db.find({})
    .then(function (dbArticle) {

      res.json(dbArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});


app.get("/articles/:id", function (req, res) {

  const id = req.params.id
  db.findOne({ _id: id })

    .then(function (dbArticle) {

      var newsave = {
        title: dbArticle.title,
        link: dbArticle.link,
        description: dbArticle.description,
        image: dbArticle.image
      }
      db2.create(newsave)
      res.json(dbArticle);

    })
    .catch(function (err) {
      res.json(err);
    });
});



app.delete("/clear", function (req, res) {

  db.deleteMany({}, function (err) { });

})

app.get("/saved", function (req, res) {

  res.render("saved")

});

app.get("/savedarticles", function (req, res) {

  db2.find({})
    .then(function (dbArticle) {

      res.json(dbArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});

app.delete("/delsaved/:id", function (req, res) {

  var id = req.params.id

  db2.findByIdAndRemove(id, function () {
  })
  res.render("saved")

})

app.delete("/clearsaved", function (req, res) {

  db2.deleteMany({}, function (err) { });

})


app.post("/articles/:id", function (req, res) {

  db3.create(req.body)
    .then(function (dbNote) {

      return db2.findOneAndModify({ _id: req.params.id }, { note: dbNote._id }, { upsert: true }, { new: true });
    })
    .then(function (dbArticle) {

      res.json(dbArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});


app.get("/notes/:id", function (req, res) {

  db3.find({ articleId: req.params.id })

    .then(function (dbNote) {

      res.json(dbNote)
    })
    .catch(function (err) {

      res.json(err);
    });
});


app.delete("/delnote/:id", function (req, res) {

  var id = req.params.id

  db3.findByIdAndRemove(id, function () {
  })
  res.render("saved")



})

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});