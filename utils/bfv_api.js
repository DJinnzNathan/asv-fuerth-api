const bfvBaseURL = "https://www.bfv.de/partial/mannschaftsprofil/";

const axios = require("axios");
const cheerio = require("cheerio");

const teams = require("./teams.json");

async function getSquad(team_id) {
  const bfvID = getBfvId(team_id);

  const squadData = axios
    .get(
      bfvBaseURL +
        "kaderliste/" +
        bfvID +
        "/kader?" +
        "?sortOrder=ALPHABETIC&showAll=1"
    )
    .then((response) => {
      const body = response.data;
      const $ = cheerio.load(body);
      let data = [];

      console.log($('.bfv-player-list-entry__name')[1]);

    //   $('.bfv-player-list-entry__name').each((tmp, i) => {
    //     console.log(tmp);
    //       data.push({id: i, name: $('.bfv-player-list-entry__name')[i]});
    //   });
      return data;
    });
  return squadData;
}

function getBfvId(team_id) {
  let temp = teams.find((item) => item.id === Number.parseInt(team_id));
  return temp.bfv_id.split("/")[1];
}

module.exports = { getSquad };
