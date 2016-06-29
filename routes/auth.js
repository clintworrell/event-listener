'use strict'


require('dotenv').load();

let express = require('express'),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
router = express.Router(),
cookieParser = require('cookie-parser'),
cookieSession = require('cookie-session'),
knex = require('../db/knex'),
passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_API_KEY,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: process.env.HOSTNAME+'/auth/google/callback',
  enableProof: true
},
function(request, accessToken, refreshToken, profile, done) {
  const data = profile._json;
  console.log("HERE WE ARE BROSSSSSSSSS");
  console.log(profile);
  knex('users').where('email', data.emails[0].value).first().then(function(user) {
    if(!user) {
      knex('users').insert({
        emails: data.emails,
        displayName: data.displayName,
        id: data.id
      })
      .returning('*')
      .then(function(user) {
        console.log('USER HAS BEEN CREATED', user);
        return done(null, user[0]);
      });
    }
    else {
      console.log('USER ALREADY EXIST', user);
      return done(null, user);
    }
  }). catch(function(error) {
    return done(error, null);
  });

}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


router.get('/google', function(req, res, next) {
  req.logout();
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.clearCookie('userID');
  next();
},
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] })
);


router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure'}),
  function(req, res) {
    res.redirect('/');
  });












module.exports = router;
