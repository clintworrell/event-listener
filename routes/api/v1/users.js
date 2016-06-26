var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('users')
  .then(function(data) {
    res.json(data);
  });
});

router.get('/:id/events', function(req, res, next) {
  knex('users')
  .where('users.id', req.params.id)
  .then(function(data) {
    res.json(data);
  });
});

router.post('/', function(req, res, next) {
  knex('users')
  .insert({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  })
  .returning('*')
  .then(function(data) {
    res.json(data);
  });
});

router.delete('/:id', function(req, res, next) {
  knex('users')
  .where('users.id', req.params.id)
  .del()
  .returning('*')
  .then(function(data) {
    res.json(data);
  });
});

module.exports = router;
