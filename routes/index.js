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
        res.render('index', {loginError: "Invalid Username/Password"});
      }
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
