const axios = require('axios');
const cheerio = require('cheerio');

var express = require('express');
var router = express.Router();

const targetURL = 'https://www.bfv.de/mannschaften/asv-fuerth/016PJQMDDO000000VV0AG811VUDIC8D7';

const matches = ($) => {
    const content = [];

    let temp = $('.bfv-statistic').find('.bfv-result-tile');

    temp.each((index, el) => {
        const match = {};

        match.matchStatus = $(el).find('.bfv-result-tile__title').text();
        match.date = '';
        match.dateTime = createDate($(el).find('.bfv-matchday-date-time > span:nth-child(2)').text());
        match.homeTeam = $(el).find('.bfv-matchdata-result__team-name--team0').text().trim();
        match.awayTeam = $(el).find('.bfv-matchdata-result__team-name--team1').text().trim();
        match.link = $(el).find('a').attr('href');

        console.log(match);
        content.push(match);
    });
    return content;
};

function createDate(string) {
    const pattern = /[ ]{2,}|[+*\n]|^\d+/g;
    let temp = string.replace(pattern, "").trim().split("/");
    let date = temp[0].split(".");
    let time = temp[1].replace("Uhr").split(":");
    let day = date[0];
    let month = date[1];
    let year = date[2];
    let hours = time[0];
    let minutes = time[1];

    console.log(parseInt(year), parseInt(month), parseInt(day), parseInt(hours), parseInt(minutes), 0, 0);

    return new Date(parseInt(year), parseInt(month), parseInt(day), parseInt(hours), parseInt(minutes), 0, 0);
}

router.get('/', (req, res) => {

    axios.get(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
        res.json(matches($));
    });
});

router.get('/last', (req, res) => {
    axios.get(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio
        const temp = matches($);
        res.json(temp[0]);
    });
});

router.get('/next', (req, res) => {
    axios.get(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio
        const temp = matches($);
        res.json(temp[1]);
    });
});

router.get('/hello', (req, res) => {
    res.json({ "text": "Hello, world in matches!" });
});

module.exports = router;