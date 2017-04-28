/**
 * Created by milosberka on 24.4.2017.
 */
const DB = require('mongoose');
const express = require('express');
const router = express.Router();

const songWorkspaceSchema = DB.Schema({
    name: String,
    creator: {type: DB.Schema.Types.ObjectId, ref: 'User'},
    users: [{type: DB.Schema.Types.ObjectId, ref: 'User'}],
    song: {type: DB.Schema.Types.ObjectId, ref: 'Song'},
    riffs: [{type: DB.Schema.Types.ObjectId, ref: 'Riff'}],
    messages: [{type: DB.Schema.Types.ObjectId, ref: 'Message'}]
});

const songSchema = DB.Schema({
    name: String,
    creator: {type: DB.Schema.Types.ObjectId, ref: 'User'},
    instrument: String,
    description: String,
    length: Number,
    key: String,
    speed: Number,
    genre: String,
    riffs: [{type: DB.Schema.Types.ObjectId, ref: 'Riff'}]
});

const messageSchema = DB.Schema({
    message: String,
    timestamp: {type: Date, default: Date.now},
    sender: {type: DB.Schema.Types.ObjectId, ref: 'User'}
});

const SongWorkspace = DB.model('SongWorkspace', songWorkspaceSchema);
const Song = DB.model('Song', songSchema);
const Message = DB.model('Message', messageSchema);

router.route('/')
    .post((req, res) => {
        res.send('Workspace created');
    })
    .get((req, res) => {
        SongWorkspace.find({}, (err, data) => {
            if (err) return res.send(err);
            res.send(JSON.stringify(data[Math.floor(Math.random() * data.length)]));
        });
    });

router.route('/song')
    .post((req, res) => {
        // Possibly not needed
        res.send('Song created');
    })
    .get((req, res) => {
        Song.find({}, (err, data) => {
            if (err) return res.send(err);
            res.send(JSON.stringify(data[Math.floor(Math.random() * data.length)]));
        });
    });

router.route('/riffs')
    .post((req, res) => {
        res.send('Added riff to workspace');
    })
    .get((req, res) => {
        res.send('Riffs in workspace');
    });

router.route('/users')
    .post((req, res) => {
        res.send('Added user to workspace');
    })
    .get((req, res) => {
        res.send('Users in workspace');
    });

router.route('/messages')
    .post((req, res) => {
        res.send('Posted message');
    })
    .get((req, res) => {
        res.send('Messages in workspace');
    });

module.exports = router;