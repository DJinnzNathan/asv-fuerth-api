const axios = require('axios');
const cheerio = require('cheerio');

function loadSite(siteURL) {
    axios.get(siteURL).then((response) => {
        const body = response.data;
        $ = cheerio.load(body); // Load HTML data and initialize cheerio
    });
    return $;
}

async function getMatches(shortTeamName) {
    try {
        const response = await axios.get('https://www.kicker.de/' + shortTeamName + '/spielplan');
        return cheerio.load(response.data);
    } catch (error) {
        console.log(error)
    }
}


function getMatchResult(date, shortTeamName) {
    const data = loadSite('https://www.kicker.de/' + shortTeamName + '/spielplan');
    console.log(data('tr'));
    return data;
}

module.exports = { getMatches, getMatchResult }