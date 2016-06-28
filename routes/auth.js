'use strict'

if(process.env.NODE.env!=='production');

let express = require('express'),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
router = express.Router(),
knex = require('../db/knex'),
passport = require('passport');

require('dotenv').load();

//console.log(process.env.GOOGLE_API_KEY);
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_API_KEY,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: process.env.HOSTNAME+'/oauth/callback'
},
function(profile, done) {
  console.log(profile);
  // const data = profile._json;
  // knex('users').where('email', data.email[0].value).first().then(function(user) {
  //   if(!user) {
  //     knex('users').insert({
  //       email:data.email,
  //       username:data.username
  //     })
  //     .returning('*')
  //     .then(function(user) {
  //       console.log('USER HAS BEEN CREATED', user);
  //       return done(null, user[0]);
  //     });
  //   }
  //   else {
  //     console.log('USER ALREADY EXIST', user);
  //     return done(null, user);
  //   }
  // }). catch(function(error) {
  //   return done(error, null);
  // });
}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  knex('users').where('id').then(function(error, user) {
    done(error, user);
  });
});

router.get('/google', function(req, res) {
  passport.authenticate('google');
});

router.get('/oauth/callback', function(req, res) {
  passport.authenticate('google');

});







module.exports = router;
