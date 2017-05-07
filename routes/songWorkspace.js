/**
 * Created by milosberka on 24.4.2017.
 */
const express = require('express');
const router = express.Router();
const database = require('../modules/database');

router.route('/')
    /**
    * @api {post} /api/songWorkspace Create new song workspace
    * @apiName Create song workspace
    * @apiGroup SongWorkspace
    *
    * @apiParam {name} Name for song workspace
    * @apiParam {instrument} Instrument
    * @apiParam {description} Description
    * @apiParam {key} Key
    * @apiParam {speed} Speed
    * @apiParam {genre} Genre
    * @apiParam {type} Type
    *
    * @apiSuccess {String} Created song workspace + data
    * */
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
    /**
     * @api {get} /api/songWorkspace Get current user's workspaces
     * @apiName Get song workspaces
     * @apiGroup SongWorkspace
     *
     * @apiSuccess {String} Created song workspace + data
     * */
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
    /**
     * @api {get} /api/songWorkspace/song Get current user's songs
     * @apiName Get songs
     * @apiGroup SongWorkspace
     *
     * @apiSuccess {Object} song(s)
     * */
    .get((req, res) => {
        database.getObjects('Song', {creator: req.user}, (error, data) => {
            res.send(data);
        });
    });

router.route('/riff')
    /**
     * @api {post} /api/songWorkspace/riff Add riff to workspace
     * @apiName Add riff to workspace
     * @apiGroup SongWorkspace
     *
     * @apiParam {workspace_id} Song workspace ID
     * @apiParam {riff_id} Riff ID
     *
     * @apiSuccess {String} Added riff to workspace + data
     * */
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
    /**
     * @api {get} /api/songWorkspace/riff Get riff from workspace
     * @apiName Get riff from workspace
     * @apiGroup SongWorkspace
     *
     * @apiParam {workspace_id} Song workspace ID
     * @apiParam {riff_id} Riff ID
     *
     * @apiSuccess {String} Riff in workspace + data
     * */
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
    /**
     * @api {get} /api/songWorkspace/riffs Get all riffs in workspace
     * @apiName Get riffs in workspace
     * @apiGroup SongWorkspace
     *
     * @apiParam {workspace_id} Song workspace ID
     *
     * @apiSuccess {String} Riffs in workspace + data
     * */
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
    /**
     * @api {post} /api/songWorkspace/users Add user to workspace
     * @apiName Add user to workspace
     * @apiGroup SongWorkspace
     *
     * @apiParam {workspace_id} Song workspace ID
     * @apiParam {user_id} User ID
     *
     * @apiSuccess {String} Added user to workspace + data
     * */
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
    /**
     * @api {post} /api/songWorkspace/users Get workspace users
     * @apiName Get all workspace users
     * @apiGroup SongWorkspace
     *
     * @apiParam {id} Song workspace ID
     *
     * @apiSuccess {String} Added user to workspace + data
     * */
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
    /**
     * @api {post} /api/songWorkspace/messages Add user to workspace
     * @apiName Add user to workspace
     * @apiGroup SongWorkspace
     *
     * @apiParam {workspace_id} Song workspace ID
     * @apiParam {message} Message to send
     *
     * @apiSuccess {String} Posted message + data
     * */
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
    /**
     * @api {get} /api/songWorkspace/messages Get workspace messages
     * @apiName Get workspace messages
     * @apiGroup SongWorkspace
     *
     * @apiParam {id} Song workspace ID
     *
     * @apiSuccess {String} Messages in workspace + data
     * */
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