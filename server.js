const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const request = require("request");
const cheerio = require("cheerio");

const db = require("./models");

const port = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static("public"));
    const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
    const databaseUri = "mongodb://localhost/webscraper";
    if (process.env.MONGODB_URI) {
        mongoose.connection(process.env.MONGODB_URI);
    } else {
        mongoose.connect(databaseUri);
    }

const mongoDB = mongoose.connection
    mongoDB.on("error", function(err){
        console.log("Mongoose error: ", err)
    });

mongoDB.once("open", function() {
    console.log("Mongoose connection successful")
})

app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.removeHeader("index", {
            article: Article
        });
    })
});

app.get("/scrape", function(req, res) {
    request("http://reddit.com/r/popular", function(err, response, html) {
        var $ = cheerio.load(html);
        var results = {};
        $("p.title").each(function(i, element) {
            var title = $(element).text();
            var link = $(element).children().attr("href");

            if (link.startsWith('\/r')) {
                link= "https://reddit.com"+link
            };
            results.title = title;
            results.link = link;
        db.Article
            .create(results)
            .then(function(dbArticle) {
            })
            .catch(function(err) {
                res.json(err)
            })
    });
    setTimeout(function() {
        res.redirect('/')}, 1000)
    })
})

app.get("/articles", function(req,res) {
    db.Article
    .find({})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req,res) {
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/articles/:id", function(req,res) {
    db.Article
    .findOne({
        _id: req.params.id
    })
    .populate("note")
    .then(function(dbArticle) {
        res.render("notes", {
            article: dbArticle
        })
    })
    .catch(function(err) {
        res.json(err);
    });
});
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "! http://localhost:" + port)
});