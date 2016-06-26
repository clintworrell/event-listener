var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('events')
  .then(function(data) {
    res.json(data);
  });
});

router.post('/', function(req, res, next) {
  knex('events')
  .insert({
    name: req.body.name,
    url: req.body.url,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    group_name: req.body.group_name,
    venue: req.body.venue
  })
  .returning('*')
  .then(function(data) {
    res.json(data);
  });
});

router.delete('/:id', function(req, res, next) {
  knex('events')
  .where('events.id', req.params.id)
  .del()
  .returning('*')
  .then(function(data) {
    res.json(data);
  });
});

module.exports = router;
