"use strict";

let express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    searchEventBriteEvents = require('./searchevents').searchEventBriteEvents,
    searchMeetupEvents = require('./searchevents').searchMeetupEvents,
    EventBriteEvent = require('../models/events').EventBriteEvent,
    MeetupEvent = require('../models/events').MeetupEvent,
    mongo = require('./searchmongo')

router.get('/', function(req, res, next) {
  let currentPage = 1;
  if (req.query.page) {
    if (req.query.page > 1) {
      currentPage = req.query.page;
    } else {
      res.redirect('/events');
    }
  } else {
    currentPage = 1;
  }
  knex('events').limit(5).offset((currentPage-1) * 5)
  .then(function(events) {
    res.render('events', {
      title: "Events",
      events: events,
      username: req.session.username,
      id: req.session.id,
      currentPage: parseInt(currentPage)
    });
  });
});

router.post('/', function(req, res, next) {
  knex('events')
  .where('name', req.body.name)
  .andWhere('organizer_name', req.body.organizer_name)
  .first()
  .then(function(existingEvent) {
    if (existingEvent) {
      knex('users_events')
      .where('users_events.user_id', req.session.id)
      .andWhere('users_events.event_id', existingEvent.id)
      .first()
      .then(function(existingUserEvent) {
        if (existingUserEvent) {
          res.json("This event is already on your list.")
        } else {
          knex('users_events')
          .insert({
            user_id: req.session.id,
            event_id: existingEvent.id
          })
          .returning('*')
          .then(function(newUserEvent) {
            res.json("Event saved.");
          })
        }
      })
    } else {
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
      .then(function(newEvent) {
        knex('users_events')
        .insert({
          user_id: req.session.id,
          event_id: newEvent[0].id
        })
        .returning('*')
        .then(function(newUserEvent) {
          res.json("Event saved.*")
        })
      });
    }
  });
});

router.post('/search', function(req, res, next) {
  let keyword = req.body.keyword;
  let location = req.body.location;
  let meetupRadius = parseInt(req.body.radius, 10) || 5;
  let eventBriteRadius = parseInt(req.body.radius, 10) + "mi" || "5mi";
  let meetupEvents = searchMeetupEvents(keyword, location, meetupRadius);
  let eventBriteEvents = searchEventBriteEvents(keyword, location, eventBriteRadius);
  Promise.all([meetupEvents, eventBriteEvents])
  .then(function(searchResponse) {
    let meetupEvents = JSON.parse(searchResponse[0].body).results;
    let eventBriteEvents = JSON.parse(searchResponse[1].body).events;
    let allEvents = [];
    let eventBritePromises = [];
    meetupEvents.forEach(function(event) {
      allEvents.push(new MeetupEvent(event));
    });
    eventBriteEvents.forEach(function(event) {
      eventBritePromises.push(mongo.promisifyMongo(new EventBriteEvent(event)));
    });
    Promise.all(eventBritePromises)
    .then(function(response) {
      let filteredEvents = [];
      response.forEach(function(pair) {
        filteredEvents.push(pair[0]);
      })
      res.render('events', {
        title: "Events",
        events: filteredEvents,
        username: req.session.username,
        id: req.session.id
      });
    })
  })
  .catch(function(error) {
    res.json(error);
  });
});

module.exports = router;
