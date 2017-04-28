'use strict';
const express = require('express');
const session = require('express-session');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = express();
mongoose.connect('mongodb://'+ process.env.DB_USER + ':' + process.env.DB_PWD + process.env.DB_HOST);
app.use(session({ secret: process.env.SESS_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 900000 }}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HTTPS
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const options = {
    key: sslkey,
    cert: sslcert
};

// MARK: routes
const user = require('./routes/user.js');
const riff = require('./routes/riff.js');
const songWorkspace = require('./routes/songWorkspace.js');
app.use('/users', user);
app.use('/riffs', riff);
app.use('/songWorkspace', songWorkspace);

const server = app.listen(3000, function () {
    console.log('Listening on port %s...', server.address().port);
});
/*const server = https.createServer(options, app).listen(3000);

http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
    res.end();
}).listen(8080);*/