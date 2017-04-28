const DB = require('mongoose');
const express = require('express');
const router = express.Router();

const userSchema = DB.Schema({
    username: String,
    password: String
});

const User = DB.model('User', userSchema);

router.route('/')
    .post((req, res) => {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        newUser.save((err, newUser) => {
            if (err) return res.send(err);
            console.log(newUser);
        });
        res.send('User added');
    })
    .get((req, res) => {
        User.find({}, (err, data) => {
            if (err) return res.send(err);
            res.send(JSON.stringify(data[Math.floor(Math.random() * data.length)]));
        });
    });

router.route('/login')
    .post((req, res) => {
        let sesh = req.session;
        let user = null;
        User.find({username: req.body.username, password: req.body.password}, '_id', (err, data) => {
            if (err) return res.send(err);
            if (data[0] == undefined) return res.send('Incorrect username or password');
            console.log(data[0]._id);
            user = data[0]._id;
            sesh.currentUser = user
            res.send('POST Logged in as: ' + sesh.currentUser);
        });
    })
    .get((req, res) => {
        let sesh = req.session;
        res.send('GET Logged in as: ' + sesh.currentUser);
    });

module.exports = router;