"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');

router.get('/:userId', function(req, res, next) {
  if (req.session.user) {
    knex('users')
    .where('id', req.params.userId)
    .then(function(user) {
      res.render('main', {
        title: "Main",
        username: req.session.user.username,
        id: req.session.user.id
      });
    })
  } else {
    res.redirect('/');
  }
});

router.get('/:userId/messages', function(req, res, next) {
  knex('messages')
  .where('receiver', req.session.user.id)
  .then(function(messages) {
    res.render('messages', {
      title: "Messages",
      messages: messages,
      username: req.session.user.username,
      id: req.session.user.id
    })
  });
});

router.get('/:userId/events', function(req, res, next) {
  knex('events')
  .join('users_events', 'users_events.event_id', 'events.id')
  .where('users_events.user_id', req.session.user.id)
  .then(function(userEvents) {
    res.render('events', {
      title: "Saved Events",
      events: userEvents,
      username: req.session.user.username,
      id: req.session.user.id
    })
  })
})

module.exports = router;
