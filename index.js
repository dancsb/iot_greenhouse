const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');

const fs = require('fs');
const http = require('http');
const https = require('https');

const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/greenhouse.dancs.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/greenhouse.dancs.org/fullchain.pem')
};

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('static'));

app.use(
    session({
        secret: '0b4/pPQ97#?PBDqDi9A0C+bVVf5q94ig',
        store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/iot_greenhouse' }),
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            domain: 'greenhouse.dancs.org',
            maxAge: 14 * 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true
        }
    })
);

const sensorboxRepo = [];
require('./mqtt/mqtt')(sensorboxRepo);
app.set('sensorboxRepo', sensorboxRepo);

require('./route/main')(app);

app.use((err, req, res, next) => {
    res.end('Problem...');
    console.log(err);
});

const httpServer = http.createServer(function (req, res) {
    res.writeHead(302, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});
const httpsServer = https.createServer(credentials, app);

httpServer.listen(804);
httpsServer.listen(4434);