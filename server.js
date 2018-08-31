const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");

const db = require("./models");

var PORT = 3000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
var MONGODB_URI = "mongodb://<dbuser>:<dbpassword>@ds133152.mlab.com:33152/heroku_n8vtvvzq" || "mongodb://localhost/newsscraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

axios.get("https://www.huffingtonpost.com/section/world-news").then(function (response) {
    const $ = cheerio.load(response.data);
    $('div.card--original-center').each(function (i, element) {
        let result = {};

        result.title = $(this).children('div.card__content').children('div.card__details').children('.card__headlines').children('.card__headline').text().trim();
        result.link = 'https://www.huffingtonpost.com' + $(this).children('div.card__content').children('a.card__image__wrapper').attr('href').trim();

        let image = $(this).children('div.card__content').children('a.card__image__wrapper').children('.card__image')
            .children('img').attr('src').trim().split("?cache")[0];

        image.includes("?ops=") ? result.image = image.split("?ops=")[0] : result.image = image;

        db.Article.create(result)
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                return err;
            })
    });
})

app.get("/articles", (req, res) =>
    db.Article.find({}).sort({
        _id: -1
    })
    .then((dbArticle) => res.json(dbArticle))
    .catch((err) => res.json(err)));

app.get("/articles/:id", (req, res) =>
    db.Article.findOne({
        _id: req.params.id
    })
    .populate("comments")
    .then((dbArticle) => res.json(dbArticle))
    .catch((err) => res.json(err)));

app.get("/comments", (req, res) =>
    db.Comment.find({})
    .then((dbNote) => res.json(dbNote))
    .catch((err) => res.json(err)));

app.get("/articlespopulated", (req, res) =>
    db.Article.find({}).sort({
        _id: -1
    })
    .populate(["comments"])
    .then((dbArticle) => res.json(dbArticle))
    .catch((err) => res.json(err)));

app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            },
            { $push: {comments: dbComment._id}} 
        )
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/comments/:id", function(req, res) {
    db.Comment.deleteOne({_id: req.body.id}, function(err,res){
        if (err) return err
    })
})

app.listen(PORT, () => console.log(`app running on localhost:${PORT}`))
