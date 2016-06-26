"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex');

router.get('/', function(req, res, next) {
  knex('events')
  .then(function(events) {
    res.render('event', {events: events});
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
  .then(function(addedEvent) {
    res.json(addedEvent);
  });
});

router.post('/search', function(req, res, next) {
  console.log("inside events/search")
  console.log(req.body);
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
