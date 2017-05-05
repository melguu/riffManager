const express = require('express');
const router = express.Router();
const database = require('../modules/database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.route('/')
    .post((req, res) => {
        database.createObject('User', req.body, (error, data) => {
           console.log(data);
           res.send(data);
        });
    })
    .get((req, res) => {
        const filter = {username: req.query.username}
        database.getObject('User', filter, (error, data) => {
            console.log(data);
            res.send(data);
        });
    });

// Authentication
router.route('/login')
    .post(passport.authenticate('local'), (req, res) => {
        res.send(req.user);
    })
    .get((req, res) => {
        res.send('Logged in as: ' + JSON.stringify(req.user));
    });

router.route('/logout')
    .get((req, res) => {
        req.logout();
        res.send('Logged out, current user: ' + JSON.stringify(req.user));
    });

passport.use(new LocalStrategy(
    (username, password, done) => {
        const filter = {
            username: username,
            password: password
        };
        database.getObject('User', filter, (error, data) => {
            if (error) return res.send(error);
            if (data == undefined) return done(null, false, {message: 'Incorrect credentials.'});
            done(null, data);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;