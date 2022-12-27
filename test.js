const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.port || 3000;

const website = 'https://www.bfv.de/mannschaften/asv-fuerth/016PJQMDDO000000VV0AG811VUDIC8D7';

// try {
//     axios(website).then((res) => {
//         const data = res.data;
//         // console.log(res.data);
//         const $ = cheerio.load(data);

//         let content = [];

//         $('.bfv-statistic', data).each(() => {
//             const lastGame = $().find('.bfv-result-tile');
//             console.log(lastGame);
//             content.push({
//                 lastGame,
//             });

//             app.get('/', (req, res) => {
//                 // res.json(content);
//                 res.send('Push');
//                 res.send(info);
//             });
//         });
//     });
// } catch (error) {
//     console.log(error, error.message);
// }

app.listen(PORT, () => {
    console.log(`server is running on PORT:${PORT}`);
});



app.get('/here', (req, res) =>{
    console.log('here');
    res.json('Hello world!');
});

// let a = document.getElementsByClassName('bfv-statistic')[0].getElementsByClassName('bfv-result-tile');
// let home, away;
// home = a[0].getElementsByClassName('bfv-matchdata-result__team-name bfv-matchdata-result__team-name--team0')[0].innerText;
// away = a[0].getElementsByClassName('bfv-matchdata-result__team-name bfv-matchdata-result__team-name--team1')[0].innerText;
// console.log(home, " -:- ", away);

// Ermittle aus Vereinsseite erste Mannschaft aus der Liste
// document.getElementsByClassName('bfv-team-list__entry-wrapper')[0].getElementsByClassName('bfv-composition-entry__content bfv-composition-entry__content--team-profilex')[0].querySelector('a').getAttribute('href')