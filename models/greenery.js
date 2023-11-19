const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Greenery = db.model('Greenery', {
    name: String,
    tempLowTreshold: Number,
    tempHighTreshold: Number,
    humLowTreshold: Number,
    humHighTreshold: Number,
    CO2LowTreshold: Number,
    CO2HighTreshold: Number,
    moistLowTreshold: Number,
    moistHighTreshold: Number
});

module.exports = Greenery;