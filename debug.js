const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');

const fs = require('fs');
const http = require('http');
const https = require('https');

const credentials = {
    key: fs.readFileSync('C:/Users/balazs/Documents/___dancs.sch.bme.hu/dancs.sch.bme.hu/privkey.pem'),
    cert: fs.readFileSync('C:/Users/balazs/Documents/___dancs.sch.bme.hu/dancs.sch.bme.hu/fullchain.pem')
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
            domain: 'dancs.sch.bme.hu',
            maxAge: 14 * 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: true
        }
    })
);

require('./route/main')(app);

app.use((err, req, res, next) => {
    res.end('Problem...');
    console.log(err);
});

const sensorboxRepo = [];
require('./mqtt/mqtt')(sensorboxRepo);
app.set('sensorboxRepo', sensorboxRepo);

const httpServer = http.createServer(function (req, res) {
    res.writeHead(302, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);