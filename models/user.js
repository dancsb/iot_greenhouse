const Schema = require('mongoose').Schema;
const db = require('../config/db');

const User = db.model('User', {
    username: String,
    email: String,
    hash: String,
    salt: String,
});

module.exports = User;