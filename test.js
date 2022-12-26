const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const PORT = process.env.port || 3000;

const website = 'https://www.bfv.de/mannschaften/asv-fuerth/016PJQMDDO000000VV0AG811VUDIC8D7';

try {
    axios(website).then((res) => {
        const data = res.data;
        const $ = cheerio.load(data);

        let content = [];

        $('.bfv-statistic', data).first(() => {
            const info = $().find('.bfv-result-tile');

            content.push({
                info,
            });

            app.get('/push', (req, res) => {
                // res.json(content);
                res.json(info);
            });
        });
    });
} catch (error) {
    console.log(error, error.message);
}

app.listen(PORT, () => {
    console.log(`server is running on PORT:${PORT}`);
});


// let a = document.getElementsByClassName('bfv-statistic')[0].getElementsByClassName('bfv-result-tile');
// let last, next;
// last = a[0].getElementsByClassName('bfv-matchdata-result__team-name bfv-matchdata-result__team-name--team0')[0].innerText;
// console.log(last);