"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    searchEventBriteEvents = require('./searchevents').searchEventBriteEvents,
    searchMeetupEvents = require('./searchevents').searchMeetupEvents,
    EventBriteEvent = require('../models/events').EventBriteEvent,
    MeetupEvent = require('../models/events').MeetupEvent;

router.get('/', function(req, res, next) {
  knex('events')
  .then(function(events) {
    res.render('events', {
      title: "Events",
      events: events,
      username: req.session.user.username
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

router.get('/searchmeetup', function(req, res, next) {
  searchMeetupEvents('Python', 'San Francisco', 5)
  .then(function(searchResponse) {
    let jsonBody = JSON.parse(searchResponse.body).results;
    let testEvent = new MeetupEvent(jsonBody[0]);
    console.log(testEvent);
    res.json(jsonBody[0]);
  });
});

router.post('/search', function(req, res, next) {
  let keyword = req.body.keyword;
  let location = req.body.location;
  let meetupRadius = parseInt(req.body.radius, 10) || 5;
  let eventBriteRadius = parseInt(req.body.radius, 10) + "mi" || "5mi";
  let meetupEvents = searchMeetupEvents(keyword, location, meetupRadius);
  let eventBriteEvents = searchEventBriteEvents(keyword, location, eventBriteRadius);
  let allEvents = Promise.all([meetupEvents, eventBriteEvents]);
  allEvents.then(function(searchResponse) {
    let meetupEvents = JSON.parse(searchResponse[0].body).results;
    let eventBriteEvents = JSON.parse(searchResponse[1].body).events;
    meetupEvents = meetupEvents.map(function(event) {
      return new MeetupEvent(event);
    });
    eventBriteEvents = eventBriteEvents.map(function(event) {
      return new EventBriteEvent(event);
    });
    let eventsPromises = [];
    meetupEvents.forEach(function(event) {
      let query = knex('events')
      .insert({
        name: event.name,
        url: event.url,
        start_time: event.start_time,
        end_time: event.end_time,
        group_name: event.group_name,
        venue: event.venue
      }).returning('*')
      eventsPromises.push(query);
    });
    eventBriteEvents.forEach(function(event) {
      let query = knex('events')
      .insert({
        name: event.name,
        url: event.url,
        start_time: event.start_time,
        end_time: event.end_time,
        group_name: event.group_name,
        venue: event.venue
      }).returning('*')
      eventsPromises.push(query);
    });
    return Promise.all(eventsPromises);
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
