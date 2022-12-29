const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const fs = require('fs/promises');

const PORT = process.env.port || 3000;

const targetURL = 'https://www.bfv.de/partial/mannschaftsprofil/spielplan/016PH3NA80000000VV0AG80NVUT1FLRU/letzte?wettbewerbsart=1&spieltyp=ALLE&from=5&size=5';

const test = ($) => {
    const content = [];
    // .bfv-matchdata-result__goals--team0
    const number = 6;
    let temp = $('.bfv-matchdata-result__goals--team1')[1];
    const key = temp.attribs['data-class-name'].replace('results-c-', '');
    const character = temp.children[0].data.trim();

    let text = key + ' : ' + character + '(' + character.charCodeAt(0) + ')' + '->' + number;
    // ' : [character, value] }
    let values = [{ [character]:number }];
    let output = { [key]: values };
    // output.values.push({ [character]:number });
    // console.log(text);
    content.push(output);
    console.log(content);

    // fetch('numbers.json').then(res => res.json()).then(data => {
    //     data.push(output);

    //     const json = JSON.stringify(data);

    //     fs.writeFile('numbers.json', json, 'utf-8', (err) => {
    //         if(err) throw err;
    //         console.log('The file has been saved!');
    //     });
    // });


    // temp.each((index, el) => {
    //     const match = {};

    //     match.matchStatus = $(el).find('.bfv-result-tile__title').text();
    //     match.date = '';
    //     match.homeTeam = $(el).find('.bfv-matchdata-result__team-name--team0').text().trim();
    //     match.awayTeam = $(el).find('.bfv-matchdata-result__team-name--team1').text().trim();
    //     match.link = $(el).find('a').attr('href');

    //     console.log(match);
    //     content.push(match);
    // });
    // addToReport('./entwicklung/auswertung.json', content);
    return content;
};

app.get('/test', (req, res) => {
    let $ = '';
    axios.get(targetURL).then((response) => {
        const body = response.data;
        $ = cheerio.load(body); // Load HTML data and initialize cheerio 
        res.json(test($));
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