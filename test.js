const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.port || 3000;

const targetURL = 'https://www.bfv.de/mannschaften/asv-fuerth-ii/016PH3NA80000000VV0AG80NVUT1FLRU';

const matches = ($) => {
    const content = [];

    let temp = $('.bfv-statistic').find('.bfv-result-tile');

    temp.each((index, el) => {
        const match = {};

        match.matchStatus = $(el).find('.bfv-result-tile__title').text();
        match.date = '';
        match.homeTeam = $(el).find('.bfv-matchdata-result__team-name--team0').text().trim();
        match.awayTeam = $(el).find('.bfv-matchdata-result__team-name--team1').text().trim();
        match.link = $(el).find('a').attr('href');

        console.log(match);
        content.push(match);
    });
    return content;
};

app.get('/matches', (req, res) => {

    axios.get(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
        console.log("Matches: ", matches);
        res.json(matches($));
    });
});

app.listen(PORT, () => {
    console.log(`server is running on PORT:${PORT}`);
});

// NOTIZEN
// let a = document.getElementsByClassName('bfv-statistic')[0].getElementsByClassName('bfv-result-tile');
// let home, away;
// home = a[0].getElementsByClassName('bfv-matchdata-result__team-name bfv-matchdata-result__team-name--team0')[0].innerText;
// away = a[0].getElementsByClassName('bfv-matchdata-result__team-name bfv-matchdata-result__team-name--team1')[0].innerText;
// console.log(home, " -:- ", away);

// Ermittle aus Vereinsseite erste Mannschaft aus der Liste
// document.getElementsByClassName('bfv-team-list__entry-wrapper')[0].getElementsByClassName('bfv-composition-entry__content bfv-composition-entry__content--team-profilex')[0].querySelector('a').getAttribute('href')