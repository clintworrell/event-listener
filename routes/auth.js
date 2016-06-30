'use strict'


require('dotenv').load();

let express = require('express'),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
router = express.Router(),
cookieParser = require('cookie-parser'),
cookieSession = require('cookie-session'),
knex = require('../db/knex'),
passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_API_KEY,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: process.env.HOSTNAME+'/auth/google/callback',
  enableProof: true
},
function(request, accessToken, refreshToken, profile, done) {
  knex('users').where({email:profile.emails[0].value, username:profile.emails[0].value.split('@')[0]}).first().then(function(user) {
    if(!user) {
      knex('users').insert({
        email: profile.emails[0].value,
        username: profile.emails[0].value.split('@')[0]
      })
      .returning('*')
      .then(function(user) {
        console.log('USER HAS BEEN CREATED', user);
        return done(null, user[0]);
      }).catch(function(error){
        done(error, null);
      });
    }
    else {
      console.log('USER ALREADY EXIST', user);
      return done(null, user);
    }
  })
  .catch(function(error) {
    return done(error, null);
  });

}));

router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.id = req.user.id;
    req.session.username = req.user.username;
    res.redirect(`/users/${req.user.id}`);
  }
);

module.exports = router;
