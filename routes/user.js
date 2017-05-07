const express = require('express');
const router = express.Router();
const database = require('../modules/database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.route('/')
    /**
     * @api {post} /api/users/ Create new user
     * @apiName Create user
     * @apiGroup User
     *
     * @apiParam {username} Username
     * @apiParam {password} Password
     *
     * @apiSuccess {Object} User
     * */
    .post((req, res) => {
        database.createObject('User', req.body, (error, data) => {
           console.log(data);
           res.send(data);
        });
    })
    /**
     * @api {get} /api/users/ Fing user
     * @apiName Find registered user
     * @apiGroup User
     *
     * @apiParam {username} Username
     *
     * @apiSuccess {Object} User
     * */
    .get((req, res) => {
        const filter = {username: req.query.username}
        database.getObject('User', filter, (error, data) => {
            console.log(data);
            res.send(data);
        });
    });

// Authentication
router.route('/login')
    /**
     * @api {post} /api/users/login Log in to service
     * @apiName Login
     * @apiGroup User
     *
     * @apiParam {username} Username
     * @apiParam {password} Password
     *
     * @apiSuccess {Object} User
     * */
    .post(passport.authenticate('local'), (req, res) => {
        res.send(req.user);
    })
    /**
     * @api {get} /api/users/login Get logged in user
     * @apiName Get logged in
     * @apiGroup User
     *
     * @apiSuccess {String} Logged in user
     * */
    .get((req, res) => {
        res.send('Logged in as: ' + JSON.stringify(req.user));
    });

router.route('/logout')
    /**
     * @api {get} /api/users/logout Log out of service
     * @apiName Logout
     * @apiGroup User
     *
     * @apiSuccess {String} Logged out, current user to make sure logout was successful
     * */
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