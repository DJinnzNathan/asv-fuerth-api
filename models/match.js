// Require mongoose library
var mongoose = require("mongoose");

// Get the schema constructor
var Schema = mongoose.Schema;

// Use the Schema constructor to create a new IdiomSchema object
var MatchSchema = new Schema({
    matchStatus: {
    type: String,
    required: true
  },
  matchTime: {
    type: Date,
    required: true
  },
  homeTeam: {
    type: String,
    required: true
  },
  awayTeam: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: false
  }
});

// Create model from schema using model method
var Match = mongoose.model("Match", MatchSchema);

// Export the Idiom model
module.exports = Match;