'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
mongoose.connect('mongodb://localhost/riffManager');

var Riff = mongoose.model('Riff', {
    name: String,
    creator: String,
    instrument: String,
    description: String,
    length: Int,
    key: String,
    speed: Int,
    genre: String,
    type: String
});

var SongWorkspace = mongoose.model('SongWorkspace', {
    name: String,
    creator: String,
    users: Array,
    song: String,
    riffs: Array,
    messages: Array,
});

var Song = mongoose.model('Song', {
    name: String,
    creator: String,
    instrument: String,
    description: String,
    length: Int,
    key: String,
    speed: Int,
    genre: String,
    riffs: Array
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/routes.js")(app);

const server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});