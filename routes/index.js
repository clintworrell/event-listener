"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  knex('users')
  .where('username', req.body.username)
  .first()
  .then(function(user) {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/users/' + req.session.id)
      } else {
        res.send("wrong password");
      }
    } else {
      res.send("no user found");
    }
  });
});

module.exports = router;
