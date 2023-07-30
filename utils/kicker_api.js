const teams = require("./teams.json");

const kickerAPI = "https://enterprise.tickaroo.com/api/embed/";

/**
 *
 * @param {*} team_id
 * @returns json with table
 */
async function getTable(team_id) {
  const token = getToken(team_id);
  const data = await fetch(kickerAPI + "table" + "?token=" + token);

  return data;
}

function getToken(team_id) {
  let temp = teams.find((item) => item.id === Number.parseInt(team_id));
  return temp.kicker_id;
}

module.exports = { getTable };
