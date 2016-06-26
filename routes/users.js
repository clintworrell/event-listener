"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:userId', function(req, res, next) {
  if (req.session.user) {
    knex('users')
    .where('id', req.params.userId)
    .then(function(user) {
      res.json(user);
    })
  } else {
    res.redirect('/');
  }
});

module.exports = router;
