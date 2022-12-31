const axios = require('axios');
const cheerio = require('cheerio');
const env = require('dotenv').config();
const path = require('path');
const numbersData = require(path.join(__dirname, '..', 'numbers.json'));

var express = require('express');
var router = express.Router();

const targetURL = process.env.BFV_TEAM_URL;

function number(key, character) {
    let result = '-';
    if (key) {
        const data = numbersData;
        // console.log(data);
        data.forEach(item => {
            if (item[key]) {
                item[key].forEach(char => {
                    if (char[character]) {
                        result = char[character];
                    }
                });
            }
        });
    }
    console.log('result: ', result);
    return result;
}

const matches = ($) => {
    const content = [];

    let temp = $('.bfv-statistic').find('.bfv-result-tile');

    temp.each((index, el) => {
        const match = {};

        match.matchStatus = $(el).find('.bfv-result-tile__title').text();
        match.matchTime = createDate($(el).find('.bfv-matchday-date-time > span:nth-child(2)').text());
        match.homeTeam = $(el).find('.bfv-matchdata-result__team-name--team0').text().trim();
        match.awayTeam = $(el).find('.bfv-matchdata-result__team-name--team1').text().trim();
        match.link = $(el).find('a').attr('href');

        let key = ($(el).find('.bfv-matchdata-result__goals--team0')[0].attribs['data-class-name']) ? $(el).find('.bfv-matchdata-result__goals--team0')[0].attribs['data-class-name'].replace('results-c-', '') : undefined;

        console.log('number', number('fh4vteor', ''));
        match.homeGoals = number(key, $(el).find('.bfv-matchdata-result__goals--team0').text().trim());
        match.awayGoals = number(key, $(el).find('.bfv-matchdata-result__goals--team1').text().trim());

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