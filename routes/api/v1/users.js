"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../../../db/knex'),
    bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  knex('users')
  .then(function(users) {
    res.json(users);
  });
});

router.get('/:id/events', function(req, res, next) {
  knex('events')
  .join('users_events', 'events.id', 'users_events.event_id')
  .where('users_events.user_id', req.params.id)
  .then(function(events) {
    res.json(events);
  });
});

router.post('/', function(req, res, next) {
  if (req.body.password === req.body.verifypassword) {
    knex('users')
    .where('username', req.body.username)
    .orWhere('email', req.body.email)
    .then(function(users) {
      if (users.length > 0) {
        res.locals.error = "That username has already been taken!";
        res.redirect('/users');
      } else {
        let hashedPassword = bcrypt.hashSync(req.body.password, 10);
        knex('users')
        .insert({
          username: req.body.username,
          password: hashedPassword,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email
        })
        .returning('*')
        .then(function(addedUser) {
          res.json(addedUser);
        });
      }
    })
  } else {
    res.locals.error = "Passwords did not match!";
    res.redirect('/users');
  }
});

router.delete('/:id', function(req, res, next) {
  knex('users')
  .where('users.id', req.params.id)
  .del()
  .returning('*')
  .then(function(deletedUser) {
    res.json(deletedUser);
  });
});

module.exports = router;
