/**
 * Created by milosberka on 24.4.2017.
 */
const express = require('express');
const multer = require('multer');
const router = express.Router();
const database = require('../modules/database');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './riffs/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype == 'audio/mpeg' || file.mimetype == 'audio/mp3') {
        cb(null, true);
    } else cb(null, false);
}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {fileSize: '20MB'} });

router.route('/')
    .get((req, res) => {
        const filter = {
            creator: req.user._id
        };
        database.getObjects('Riff', filter, (error, data) => {
            res.send('Your riffs: ' + JSON.stringify(data));
        });
    });

router.route('/single')
    .post(upload.single('riff'), (req, res) => {
        const riffData = {
            name: req.body.name,
            creator: req.user._id,
            instrument: req.body.instrument,
            description: req.body.description,
            length: req.body.length,
            key: req.body.key,
            speed: req.body.speed,
            genre: req.body.genre,
            type: req.body.type,
            path: req.file.path
        };
        database.createObject('Riff', riffData, (error, data) => {
            res.send('Riff uploaded: ' + data);
        });
    })
    .get((req, res) => {
        const filter = {
            _id: req.query.id
        };
        database.getObject('Riff', filter, (error, data) => {
            res.sendFile(data.path, { root: './' });
        });
    });

module.exports = router;