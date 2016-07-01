"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt'),
    searchMeetupEvents = require('./searchevents').searchMeetupEvents,
    parseDate = require('./searchevents').parseDate,
    MeetupEvent = require('../models/events').MeetupEvent;

router.get('/', function(req, res, next) {
  if (req.session.id) {
    res.redirect('/users/' + req.session.id + '/events');
  } else {
    res.render('index');
  }
});

router.post('/', function(req, res, next) {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  req.session.location = {
    latitude: latitude,
    longitude: longitude
  }
  let keyword = null;
  let location = null;
  let meetupRadius = 10;
  let allEvents = [];
  if(latitude && longitude) {
    let meetupEvents = searchMeetupEvents(keyword, location, meetupRadius, latitude, longitude);
    meetupEvents
    .then(function(searchResponse) {
      let meetupEvents = JSON.parse(searchResponse.body).results;
      allEvents = meetupEvents.map(function(event) {
        return new MeetupEvent(event);
      });
      allEvents.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
      });

      allEvents.forEach(function(event) {
        event.start_time = parseDate(event.start_time);
        event.end_time = parseDate(event.end_time);
      });
      res.render('eventspartial', {
        events: allEvents
      });

    });
  }

});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

router.post('/login', function(req, res, next) {
  knex('users')
  .where('username', req.body.username)
  .first()
  .then(function(user) {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.id = user.id;
        req.session.username = user.username;
        res.redirect('/users/' + req.session.id + '/events');
      } else {
        res.render('index', {loginError: "Invalid Username/Password"});
      }
    } else {
      res.render('index', {loginError: "Invalid Username/Password"});
    }
  });
});

router.post('/signup', function(req, res, next) {
  if (req.body.password === req.body.password2) {
    knex('users')
    .where('username', req.body.username)
    .orWhere('email', req.body.email)
    .first()
    .then(function(user) {
      if (user) {
        res.render('index', {signUpError: "Account already exists."});
      } else {
        let hash = bcrypt.hashSync(req.body.password, 10);
        knex('users')
        .insert({
          username: req.body.username,
          password: hash,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email
        })
        .returning('*')
        .then(function(newUser) {
          req.session.id = newUser[0].id;
          req.session.username = newUser[0].username;
          res.redirect('/users/' + req.session.id);
        });
      }
    });
  } else {
    res.render('index', {signUpError: "Passwords do not match."})
  }
});

module.exports = router;
