const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Greenery = db.model('Greenery', {
    name: String,
    tempLowThreshold: Number,
    tempHighThreshold: Number,
    humLowThreshold: Number,
    humHighThreshold: Number,
    CO2LowThreshold: Number,
    CO2HighThreshold: Number,
    moistLowThreshold: Number,
    moistHighThreshold: Number
});

module.exports = Greenery;