const express = require("express");
const env = require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const router = express.Router();

const cachePath = "./database";
const defaultCacheTime = 4 * 60 * 60 * 1000;

const readJsonCache = (name) => {
  try {
    return JSON.parse(fs.readFileSync(`${cachePath}/${name}.json`, "utf-8"));
  } catch (err) {
    return undefined;
  }
};

const writeJsonCache = (name, data) => {
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
  fs.writeFile(`${cachePath}/${name}.json`, JSON.stringify(data), (err) => {
    if (err) console.log(err);
  });
};

const table = ($) => {
  const content = [];

  const temp = $(".bfv-profile-tables__content-wrapper").find("table");

  temp.find(".bfv-table-entry--data").each((index, el) => {
    const rank = {};

    rank.position = parseInt(
      $(el).find('td[class*="position"]').text().replace(".", "").trim()
    );
    rank.team = $(el).find("a").text().trim();
    rank.played = parseInt($(el).find('td[class*="matches"]').text().trim());
    rank.won = parseInt($(el).find('td[class*="wins"]').text().trim());
    rank.draws = parseInt($(el).find('td[class*="draws"]').text().trim());
    rank.lost = parseInt($(el).find('td[class*="loses"]').text().trim());
    rank.goalsFor = parseInt(
      $(el).find('td[class*="goalratio"]').text().trim().split(":")[0]
    );
    rank.goalsAgainst = parseInt(
      $(el).find('td[class*="goalratio"]').text().trim().split(":")[1]
    );
    rank.goalDifference = parseInt(
      $(el).find('td[class*="goaldifference"]').text().trim()
    );
    rank.points = parseInt($(el).find('td[class*="score"]').text().trim());
    // TODO: Fix trend property
    rank.trend = () => {
      let sign = "";
      if ($(el).find('td[class*="up"]').text()) {
        sign = "up";
      } else if ($(el).find('td[class*="down"]').text()) {
        sign = "down";
      } else return sign;
    };
    rank.promoted = $(el).find('td[class*="promoted"]').text() != "";
    rank.demoted = $(el).find('td[class*="demoted"]').text() != "";
    rank.relegation = $(el).find('td[class*="relegation"]').text() != "";

    content.push(rank);
  });
  return content;
};

const matches = ($) => {
  const content = [];

  let temp = $(".bfv-statistic").find(".bfv-result-tile");

  temp.each((index, el) => {
    const match = {};

    match.matchStatus = $(el).find(".bfv-result-tile__title").text();
    match.matchTime = createDate(
      $(el).find(".bfv-matchday-date-time > span:nth-child(2)").text()
    );
    match.homeTeam = $(el)
      .find(".bfv-matchdata-result__team-name--team0")
      .text()
      .trim();
    match.awayTeam = $(el)
      .find(".bfv-matchdata-result__team-name--team1")
      .text()
      .trim();
    match.link = $(el).find("a").attr("href");

    let key = $(el).find(".bfv-matchdata-result__goals--team0")[0].attribs[
      "data-class-name"
    ]
      ? $(el)
          .find(".bfv-matchdata-result__goals--team0")[0]
          .attribs["data-class-name"].replace("results-c-", "")
      : undefined;

    console.log("number", number("fh4vteor", ""));
    match.homeGoals = number(
      key,
      $(el).find(".bfv-matchdata-result__goals--team0").text().trim()
    );
    match.awayGoals = number(
      key,
      $(el).find(".bfv-matchdata-result__goals--team1").text().trim()
    );

    content.push(match);
  });
  return content;
};

router.get("/tables", (req, res, next) => {
  //TODO fix
  const teamsMeta = readJsonCache("teams");
  let tables = [];
  teamsMeta.each((team) => {
    let singleTable = table(team.link);
    let singleData = {
      teamname: team.teamname,
      table: singleTable,
    };
    tables.push(singleData);
  });
  res.json(tables);
});

router.get("/matches", (req, res, next) => {});

router.get("/teams", (req, res, next) => {
  let db = [];
  axios
    .get(
      `https://www.bfv.de/vereine/${process.env.BFV_CLUB_NAME}/${process.env.BFV_CLUB_SLUG}`
    )
    .then((response) => {
      const body = response.data;
      const $ = cheerio.load(body);
      $(".bfv-composition-entry").each((_, e) => {
        let team = {
          teamname: $(e)
            .find(".bfv-composition-entry__team-name")
            .text()
            .trim(),
          level: $(e).find(".bfv-composition-entry__category").text().trim(),
          slug: $(e)
            .find(".bfv-composition-entry__team-link")
            .attr("href")
            .split("https://www.bfv.de/mannschaften/")[1]
            .split("/")[1],
          link: $(e).find(".bfv-composition-entry__team-link").attr("href"),
        };
        db.push(team);
      });
      writeJsonCache("teams", db);
    });
  res.send(`Teams updated`);
});

router.get("/weather", (req, res) => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${process.env.OPENWEATHER_LAT}&lon=${process.env.OPENWEATHER_LON}&appid=${process.env.OPENWEATHER_API}&units=metric&lang=de`
    )
    .then((response) => {
      const { name, main, weather } = response.data;
      const data = {
        date: new Date().getTime(),
        data: { name, main, weather },
      };
      writeJsonCache("weather", data);
    });
  res.send("Weather updated");
});

module.exports = router;
