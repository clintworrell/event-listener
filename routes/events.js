"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    searchEventBriteEvents = require('./eventbrite'),
    Events = require('../models/events');

router.get('/', function(req, res, next) {
  knex('events')
  .then(function(events) {
    res.render('events', {
      title: "Events",
      events: events
    });
  });
});

// router.post('/', function(req, res, next) {
//   knex('events')
//   .insert({
//     name: req.body.name,
//     url: req.body.url,
//     start_time: req.body.start_time,
//     end_time: req.body.end_time,
//     group_name: req.body.group_name,
//     venue: req.body.venue
//   })
//   .returning('*')
//   .then(function(addedEvent) {
//     res.json(addedEvent);
//   });
// });

router.post('/search', function(req, res, next) {
  let keyword = req.body.keyword;
  let location = req.body.location;
  let radius = req.body.radius || '5mi';
  let events = searchEventBriteEvents(keyword, location, radius);
  events.then(function(searchResponse){
    let jsonBody = JSON.parse(searchResponse.body);
    let events = jsonBody.events.map(function(event) {
      return new Events(event);
    });
    let promises = [];
    events.forEach(function(event) {
      let query = knex('events')
      .insert({
        name: event.name,
        url: event.url,
        start_time: event.start_time,
        end_time: event.end_time,
        group_name: event.group_name,
        venue: event.venue
      }).returning('*')
      promises.push(query);
    });
    return Promise.all(promises);
  })
  .then(function(data) {
    res.redirect('/events');
  })
  .catch(function(error) {
    console.log(error);
  });
});

// router.delete('/:id', function(req, res, next) {
//   knex('events')
//   .where('events.id', req.params.id)
//   .del()
//   .returning('*')
//   .then(function(deletedEvent) {
//     res.json(deletedEvent);
//   });
// });

module.exports = router;
