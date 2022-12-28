const axios = require('axios');
const cheerio = require('cheerio');
const env = require('dotenv').config();

var express = require('express');
const { download } = require('express/lib/response');
var router = express.Router();

const targetURL = process.env.BFV_TEAM_URL;

const table = ($) => {
    const content = [];

    let temp = $('.bfv-profile-tables__content-wrapper').find('table');

    temp.find('.bfv-table-entry--data').each((index, el) => {
        const rank = {};

        rank.position = parseInt($(el).find('td[class*="position"]').text().replace('.', '').trim());
        rank.team = $(el).find('a').text().trim();
        rank.played = parseInt($(el).find('td[class*="matches"]').text().trim());
        rank.won = parseInt($(el).find('td[class*="wins"]').text().trim());
        rank.draws = parseInt($(el).find('td[class*="draws"]').text().trim());
        rank.lost = parseInt($(el).find('td[class*="loses"]').text().trim());
        rank.goalsFor = parseInt($(el).find('td[class*="goalratio"]').text().trim().split(':')[0]);
        rank.goalsAgainst = parseInt($(el).find('td[class*="goalratio"]').text().trim().split(':')[1]);
        rank.goalDifference = parseInt($(el).find('td[class*="goaldifference"]').text().trim());
        rank.points = parseInt($(el).find('td[class*="score"]').text().trim());
        //TODO: Fix trend property
        rank.trend = () => {
            let sign = ''
            if ($(el).find('td[class*="up"]').text()) {
                sign = 'up';
            } else if ($(el).find('td[class*="down"]').text()) {
                sign = 'down';
            } else return sign;
        };
        rank.promoted = ($(el).find('td[class*="promoted"]').text() != "") ? true : false;
        rank.demoted = ($(el).find('td[class*="demoted"]').text() != "") ? true : false;
        rank.relegation = ($(el).find('td[class*="relegation"]').text() != "") ? true : false;

        content.push(rank);
    });
    return content;
};

router.get('/', (req, res) => {

    axios.get(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
        res.json(table($));
    });
});

router.get('/now', (req, res) => {

    axios.get(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
        let result = table($).find((item) => {
            return item.team == process.env.CLUB_NAME;
        });
        res.json(result);
    });
});

module.exports = router;