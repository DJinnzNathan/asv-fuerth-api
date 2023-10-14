const teams = require("./teams.json");

const kickerAPI = "https://enterprise.tickaroo.com/api/embed/";

/**
 * Returns a JSON of table from a team
 * @param {*} team_id
 * @returns json with table
 */
async function getTable(team_id) {
  const token = getToken(team_id);
  const data = await fetch(kickerAPI + "table" + "?token=" + token);

  return data;
}

async function getSchedule(team_id) {
  const token = getToken(team_id);
  const data = await fetch(kickerAPI + "team_schedule" + "?token=" + token);

  return data;
}

async function getSquad(team_id) {
  const token = getToken(team_id);
  const data = await fetch(kickerAPI + "squad" + "?token=" + token);

  return data;
}

function getToken(team_id) {
  let temp = teams.find((item) => item.id === Number.parseInt(team_id));
  return temp.kicker_id;
}

module.exports = { getTable, getSchedule, getSquad };
