const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Log = db.model('Log', {
    date: {
        type: Date,
        default: Date.now
    },
    serialNumber: String,
    action: String
});

module.exports = Log;