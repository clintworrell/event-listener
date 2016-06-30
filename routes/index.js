"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  if (req.session.id) {
    res.redirect('/users/' + req.session.id);
  } else {
    res.render('index');
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
        res.redirect('/users/' + req.session.id);
      } else {
        res.render('index', {loginError: "Wrong password!"});
      }
    } else {
      res.render('index', {loginError: "Username not found!"});
    }
  });
});

module.exports = router;
