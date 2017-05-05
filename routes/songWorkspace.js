/**
 * Created by milosberka on 24.4.2017.
 */
const express = require('express');
const router = express.Router();
const database = require('../modules/database');

router.route('/')
    .post((req, res) => {
        const songData = {
            name: req.body.name,
            creator: req.user._id,
            instrument: req.body.instrument,
            description: req.body.description,
            key: req.body.key,
            speed: req.body.speed,
            genre: req.body.genre,
            riffs: []
        };
        database.createObject('Song', songData, (error, data) => {
            const workspaceData = {
                name: data.name,
                creator: data.creator,
                users: [data.creator],
                song: data._id,
                riffs: [],
                messages: []
            }
            database.createObject('SongWorkspace', workspaceData, (error, data) => {
               res.send('Created song workspace: ' + JSON.stringify(data));
            });
        });
    })
    .get((req, res) => {
        database.getObjects('SongWorkspace', {creator: req.user}, (error, data) => {
            res.send(data);
        });
    });

router.route('/song')
    .post((req, res) => {
        // Possibly not needed
        res.send('Song created');
    })
    .get((req, res) => {
        database.getObjects('Song', {creator: req.user}, (error, data) => {
            res.send(data);
        });
    });

router.route('/riff')
    .post((req, res) => {
        const filter = {
            _id: req.body.workspace_id
        };
        const data = {
            $push: {riffs: req.body.riff_id}
        };
        database.updateObject('SongWorkspace', filter, data, (error, data) => {
            res.send('Added riff to workspace: ' + data);
        });
    })
    .get((req, res) => {
        const filter = {
            _id: req.query.workspace_id
        };
        database.getObject('SongWorkspace', filter, (error, data) => {
            const riff = data.riffs.filter((riff) => riff._id == req.query.riff_id);
            res.send('Riff in workspace: ' + riff);
        });
    });

router.route('/riffs')
    .get((req, res) => {
        const filter = {
            _id: req.query.id
        };
        database.getObject('SongWorkspace', filter, (error, data) => {
            const riffs = data.riffs
            res.send('Riffs in workspace: ' + riffs);
        });
    });

router.route('/users')
    .post((req, res) => {
            const filter = {
                _id: req.body.workspace_id
            };
            const data = {
                $push: {users: req.body.user_id}
            };
            database.updateObject('SongWorkspace', filter, data, (error, data) => {
                res.send('Added user to workspace: ' + data);
            });
    })
    .get((req, res) => {
        const filter = {
            _id: req.query.id
        };
        database.getObject('SongWorkspace', filter, (error, data) => {
            const users = data.users;
            res.send('Users in workspace: ' + users);
        });
    });

router.route('/messages')
    .post((req, res) => {
        const messageData = {
            message: req.body.message,
            sender: req.user._id
        };
        database.createObject('Message', messageData,  (error, data) => {
            const filter = {
                _id: req.body.workspace_id
            };
            const dataForWorkspace = {
                $push: {messages: data._id}
            };
            database.updateObject('SongWorkspace', filter, dataForWorkspace, (error, data) => {
                res.send('Posted message: ' + data);
            });
        });
    })
    .get((req, res) => {
        const filter = {
            _id: req.query.id
        };
        database.getObject('SongWorkspace', filter, (error, data) => {
            const messages = data.messages
            res.send('Messages in workspace: ' + messages);
        });
    });

module.exports = router;