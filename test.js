const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const fs = require('fs');

const PORT = process.env.port || 3001;

const targetURL = 'https://www.bfv.de/partial/mannschaftsprofil/spielplan/016PH3NA80000000VV0AG80NVUT1FLRU/letzte?wettbewerbsart=1&spieltyp=ALLE&from=5&size=5';


function readFromJSONFile(filename) {
    return JSON.parse(fs.readFileSync(filename));
}

function writeToJSONFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function collectNumber(key, character, values) {
    console.log('key: ', key);
    console.log('character: ', character);
    let data = readFromJSONFile('numbers.json');
    console.log('if 1', data.some(item => item.hasOwnProperty(key)));
    if (data.some(item => item.hasOwnProperty(key))) {
        let pos = data.findIndex(item => item.hasOwnProperty(key));
        console.log('Characters', data[pos][key]);
        console.log('if 2', 'char exist:', !data[pos][key].some(item => item.hasOwnProperty(character)));
        if (!data[pos][key].some(item => item.hasOwnProperty(character))) {
            console.log('Teilweises Einfügen', data[pos][key]);
            data[pos][key].push(values[0]);
            writeToJSONFile('numbers.json', data);
        }
    } else {
        console.log('key existiert nicht -> Kombi wird eingefügt');
        data.push({ [key]: values });
        writeToJSONFile('numbers.json', data);
    }
}

function test($, row, number, homeTeam) {
    const content = [];
    let teamClass = (homeTeam) ? '.bfv-matchdata-result__goals--team0' : '.bfv-matchdata-result__goals--team1';
    const goalData = $(teamClass);
    let temp = goalData[row];
    const key = temp.attribs['data-class-name'].replace('results-c-', '');
    const character = temp.children[0].data.trim();
    console.log(key + ' : ' + character + '(' + character.charCodeAt(0) + ')' + '->' + number);

    let values = [{ [character]: number }];
    let output = { [key]: values };
    content.push(output);
    collectNumber(key, character, values);

    console.log(content);
    return content;
};

app.get('/test', (req, res) => {
    let $ = '';
    axios.get(targetURL).then((response) => {
        const body = response.data;
        $ = cheerio.load(body); // Load HTML data and initialize cheerio 
        res.json(test($, 1, 6, false));
    });
});

app.get('/m', (req, res) => {
    const row = parseInt(req.query.row);
    const goals = parseInt(req.query.goals);
    const home = req.query.home;
    axios.get(targetURL).then((response) => {
        const body = response.data;
        $ = cheerio.load(body); // Load HTML data and initialize cheerio
        test($, row, goals, home);
    });
    res.send({ "row": row, "goals": goals, "home": home });
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