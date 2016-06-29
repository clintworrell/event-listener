"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');

// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/:userId', function(req, res, next) {
  console.log("req.session.user");
  console.log(req.session.user)
  if (req.session.user) {
    knex('users')
    .where('id', req.params.userId)
    .then(function(user) {
      res.render('main', {
        title: "Main",
        username: req.session.user.username
      });
    })
  } else {
    res.redirect('/');
  }
});

module.exports = router;
