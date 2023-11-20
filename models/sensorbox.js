const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Sensorbox = db.model('Sensorbox', {
    serialNumber: String,
    _greenery: {
        type: Schema.Types.ObjectId,
        ref: 'Greenery'
    },
    _supervisor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = Sensorbox;