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

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
    knex('users')
    .where({username:req.body.username, email:req.body.email})
    .first()
    .then(function(user) {
      if(!user) {
        var hash = bcrypt.hashSync(req.body.password, 8);
        knex('users').insert({
          id: req.session.id,
          username: req.body.username,
          email: req.body.email,
          password: hash
        })
        .returning('*')
        .then(function(user) {
          req.session.id = user.id;
          req.session.username = user.username;
          res.redirect('/users/' + req.session.id);
        });
      } else {
        res.send('Account already exists');
      }
    });
});

module.exports = router;
