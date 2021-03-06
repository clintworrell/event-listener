"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../../../db/knex');

router.get('/', function(req, res, next) {
  knex('events')
  .then(function(events) {
    res.json(events);
  });
});

router.post('/', function(req, res, next) {
  knex('events')
  .insert({
    name: req.body.name,
    url: req.body.url,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    organizer_name: req.body.organizer_name,
    venue_name: req.body.venue_name
  })
  .returning('*')
  .then(function(addedEvent) {
    res.json(addedEvent);
  });
});

router.delete('/:id', function(req, res, next) {
  knex('events')
  .where('events.id', req.params.id)
  .del()
  .returning('*')
  .then(function(deletedEvent) {
    res.json(deletedEvent);
  });
});

module.exports = router;
