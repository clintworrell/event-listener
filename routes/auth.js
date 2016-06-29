'use strict'


require('dotenv').load();

let express = require('express'),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
router = express.Router(),
cookieParser = require('cookie-parser'),
cookieSession = require('cookie-session'),
knex = require('../db/knex'),
passport = require('passport');

// router.use(passport.initialize());
// router.use(passport.session());



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_API_KEY,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL: process.env.HOSTNAME+'/auth/google/callback',
  enableProof: true
},
function(request, accessToken, refreshToken, profile, done) {
console.log(profile);

  knex('users').where({email:profile.emails[0].value, username:profile.emails[0].value.split('@')[0]}).first().then(function(user) {
    console.log(user);
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
      //manage cookie;
      //res.cookie();
      return done(null, user);
    }
  }). catch(function(error) {
    return done(error, null);
  });

}));

//
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   done(null, id);
// });


router.get('/google',
  // function(req, res, next) {
  // req.logout();
  // res.clearCookie('session');
  // res.clearCookie('session.sig');
  // res.clearCookie('userID');
  // next();
  // },
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] })
);


router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = req.user;
    res.redirect(`/users/${req.user.id}`);
  }
);












module.exports = router;
