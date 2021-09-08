const express = require('express');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();


var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET =  process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser(function (user, done) {
    console.log('Serialize User is', user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('DeSerialize User', user);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        console.log('AccessToken is', accessToken);
        console.log('RefreshToken  is', refreshToken);
        console.log('Profile is', profile);
        done(null, profile);
    }
));


const app = express();

app.listen(3000, () => {
    console.log('Server Started Running on PORT 3000');
});
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', function (req, res, next) {
    next();
},
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/auth/google/callback',
    function (req, res, next) {
        next();
    },
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    }));

app.get('/auth/google/success', function (req, res) {
    return res.send({
        result: "success"
    });
});

app.get('/auth/google/failure', function (req, res) {
    return res.send({
        result: "failure"
    });
});

