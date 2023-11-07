const Schema = require('mongoose').Schema;
const db = require('../config/db');

const User = db.model('User', {
    username: String,
    hash: String,
    salt: String,
    note: String
});

module.exports = User;