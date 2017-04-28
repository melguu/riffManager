/**
 * Created by milosberka on 24.4.2017.
 */
const DB = require('mongoose');
const express = require('express');
const router = express.Router();

const riffSchema = DB.Schema({
    name: String,
    creator: {type: DB.Schema.Types.ObjectId, ref: 'User'},
    instrument: String,
    description: String,
    length: Number,
    key: String,
    speed: Number,
    genre: String,
    type: String
});

const Riff = DB.model('Riff', riffSchema);

router.route('/')
    .post((req, res) => {
        //Upload riff
        res.send('Riff uploaded, current user: ' + req.session.currentUser);
    })
    .get((req, res) => {
        Riff.find({}, (err, data) => {
            if (err) return res.send(err);
            res.send(JSON.stringify(data[Math.floor(Math.random() * data.length)]));
        });
    });

module.exports = router;