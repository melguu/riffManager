'use strict';
// Imports
const express = require('express');
const session = require('express-session');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const passport = require('passport');
const database = require('./modules/database');
const cors = require('cors');

// Init
const app = express();
app.use(cors());
//const front = express();
database.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PWD + process.env.DB_HOST);
app.use(session({ secret: process.env.SESS_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 900000 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HTTPS
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const options = {
    key: sslkey,
    cert: sslcert
};

/*app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'origin, x-http-method-override, accept, content-type, authorization, x-pingother, if-match, if-modified-since, if-none-match, if-unmodified-since, x-requested-with');
    res.header('Access-Control-Expose-Headers', 'tag, link, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes');
    next();
});*/

/*front.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'origin, x-http-method-override, accept, content-type, authorization, x-pingother, if-match, if-modified-since, if-none-match, if-unmodified-since, x-requested-with');
    res.header('Access-Control-Expose-Headers', 'tag, link, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes');
    next();
});*/

// Routes
app.all('/api/*', checkAuthentication);

const user = require('./routes/user.js');
const riff = require('./routes/riff.js');
const songWorkspace = require('./routes/songWorkspace.js');
app.use('/api/users', user);
app.use('/api/riffs', riff);
app.use('/api/songWorkspace', songWorkspace);
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: './' });
});
app.get('/login', (req, res) => {
    res.sendFile('public/login.html', { root: './' });
});

function checkAuthentication(req,res,next){
    if(req.originalUrl == '/api/users/login' || req.originalUrl == '/api/users/login/') return next();
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect('/login');
        //res.send('Not authenticated');
    }
}

const server = https.createServer(options, app).listen(3000);

http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
    res.end();
}).listen(8080);

//const frontEnd = https.createServer(options, front).listen(3001);