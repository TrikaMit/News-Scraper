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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true)


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
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err){
            return err;
        })


        
        

        //   db.create(result)
        //   .then(function(article) {
        //       console.log(article)
        //   }).catch(function(err) {
        //       return res.json(err);
        //   })
    });

});
