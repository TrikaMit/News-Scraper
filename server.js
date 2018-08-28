const cheerio = require("cheerio");
const request = require("request");

request("https://www.huffingtonpost.com/section/world-news", function(error, response, html) {
  const $ = cheerio.load(html);
  const results = [];
//   .children('div.card').each

  $('div.card--original-center', 'section#zone-original-center').each(function(i,element) {
    //   console.log(element)
    let link = 'https://www.huffingtonpost.com'+$(element).children('div.card__content').children('a.card__image__wrapper').attr('href').trim();
    let title = $(element).children('div.card__content').children('div.card__details').children('.card__headlines').children('.card__headline').text().trim();
    let imgFull = $(element).children('div.card__content').children('a.card__image__wrapper').children('.card__image').children('img').attr('src').trim();
    let img = imgFull.split("?cache")[0];
    if (img.includes("?ops=")){
        img = img.split("?ops=")[0];
    }
    results.push({
      title: title,
      link: link,
      img: img
    });
  });

  console.log(results);
});
