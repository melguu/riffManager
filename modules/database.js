/**
 * Created by milosberka on 24.4.2017.
 */
'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Schemas
const schemas = {
    User: mongoose.Schema({
        username: String,
        password: String
    }),
    Riff: mongoose.Schema({
        name: String,
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        instrument: String,
        description: String,
        length: Number,
        key: String,
        speed: Number,
        genre: String,
        type: String,
        path: String
    }),
    SongWorkspace: mongoose.Schema({
        name: String,
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        song: {type: mongoose.Schema.Types.ObjectId, ref: 'Song'},
        riffs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Riff'}],
        messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
    }),
    Song: mongoose.Schema({
        name: String,
        creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        instrument: String,
        description: String,
        length: Number,
        key: String,
        speed: Number,
        genre: String,
        riffs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Riff'}]
    }),
    Message: mongoose.Schema({
        message: String,
        timestamp: {type: Date, default: Date.now},
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    })
};

// Models
const User = mongoose.model('User', schemas.User);
const Riff = mongoose.model('Riff', schemas.Riff);
const SongWorkspace = mongoose.model('SongWorkspace', schemas.SongWorkspace);
const Song = mongoose.model('Song', schemas.Song);
const Message = mongoose.model('Message', schemas.Message);

// Functions
const connect = (url) => {
    mongoose.connect(url).then(() => {
        console.log('connected to mongoose');
    }, (err) => {
        console.log('could not connect to mongoose');
    });
};

const getObject = (key, filter, callback) => {
    const model = mongoose.model(key, schemas.key);
    model.findOne(filter, (err, data) => {
        if (!err) {
            callback(null, data);
        } else callback(err, null);
    });
};

const getObjects = (key, filter, callback) => {
    const model = mongoose.model(key, schemas.key);
    model.find(filter, (err, data) => {
        if (!err) {
            callback(null, data);
        } else callback(err, null);
    });
};

const createObject = (key, data, callback) => {
    const model = mongoose.model(key, schemas.key);
    model.create(data, (err, data) => {
        if (!err) {
            callback(null, data)
        } else callback(err, null);
    });

};

const updateObject = (key, filter, data, callback) => {
    const model = mongoose.model(key, schemas.key);
    model.findOneAndUpdate(filter, data, (err, data) => {
        if (!err) {
            callback(null, data);
        } else callback(err, null);
    });
};

const removeObject = (key, filter, data, callback) => {
    const model = mongoose.model(key, schemas.key);
    model.findOneAndRemove(filter, data, (err, data) => {
        if (!err) {
            callback(null, data);
        } else callback(err, null);
    });
};

module.exports = {
    connect: connect,
    getObject: getObject,
    getObjects: getObjects,
    createObject: createObject,
    updateObject: updateObject,
    removeObject: removeObject
};
