"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');

router.use('/:userId*', function(req, res, next) {
  if (req.session.id == req.params.userId) {
    next();
  } else {
    res.redirect("/");
  }
});

router.get('/:userId', function(req, res, next) {
  knex('users')
  .where('id', req.params.userId)
  .then(function(user) {
    res.render('main', {
      title: "Main",
      username: req.session.username,
      id: req.session.id
    });
  });
});

router.get('/:userId/messages', function(req, res, next) {
  knex('messages')
  .where('receiver', req.session.id)
  .then(function(messages) {
    res.render('messages', {
      title: "Messages",
      messages: messages,
      username: req.session.username,
      id: req.session.id
    })
  });
});

router.get('/:userId/events', function(req, res, next) {
  knex('events')
  .join('users_events', 'users_events.event_id', 'events.id')
  .where('users_events.user_id', req.session.id)
  .then(function(userEvents) {
    res.render('events', {
      title: "Saved Events",
      events: userEvents,
      username: req.session.username,
      id: req.session.id
    })
  })
})

module.exports = router;
