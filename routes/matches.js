const axios = require('axios');
const cheerio = require('cheerio');
const env = require('dotenv').config();
const path = require('path');
const kicker = require(path.join(__dirname,'../services/kicker'));

var express = require('express');
var router = express.Router();

const targetURL = process.env.BFV_TEAM_URL;


const matches = (bfv) => {
    const content = [];

    let temp = bfv('.bfv-statistic').find('.bfv-result-tile');

    temp.each((index, el) => {
        const match = {};
        
        match.matchStatus = bfv(el).find('.bfv-result-tile__title').text();
        match.matchTime = createDate(bfv(el).find('.bfv-matchday-date-time > span:nth-child(2)').text());
        match.homeTeam = bfv(el).find('.bfv-matchdata-result__team-name--team0').text().trim();
        match.awayTeam = bfv(el).find('.bfv-matchdata-result__team-name--team1').text().trim();
        match.link = bfv(el).find('a').attr('href');
        
        //TODO 
        const kickerData = kicker.getMatches(process.env.KICKER_SECOND_TEAM_SHORTNAME).then(() => {return this;});
        console.log(kickerData);
        // match.homeGoals = ;
        // match.awayGoals = ;

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

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), 0, 0);
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

module.exports = router;