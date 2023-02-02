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
    return JSON.parse(fs.readFileSync(`${cachePath}/${name}`, "utf-8"));
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
        console.log(team);
        db.push(team);
      });
      console.log(db);
      writeJsonCache("teams", db);
    });
  res.send("Teams updated");
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
      writeJsonCache('weather', data);
    });
  res.send("Weather updated");
});

module.exports = router;
