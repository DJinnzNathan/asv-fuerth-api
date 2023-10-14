const express = require("express");

const router = express.Router();

const kicker = require("../utils/kicker_api");
const bfv = require("../utils/bfv_api");

router.get("/", async (req, res) => {
  let team = req.query.team_id;
  const response = await kicker.getSquad(team);
  const data = await response.json();
  res.json(data);
});

router.get("/bfv", async (req, res) => {
  let team = req.query.team_id;
  const response = await bfv.getSquad(team);
  // const data = await response.json();
  console.log(response);
  res.send(response);
});

module.exports = router;