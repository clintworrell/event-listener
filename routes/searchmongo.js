"use strict";

let MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    assert = require('assert'),
    mongo = require('mongodb'),
    monk = require('monk');
    var db = monk(process.env.MONGODB_URI);

let organizers = db.get('organizers');
let venues = db.get('venues');

function promisifyMongo(event) {
  return Promise.all([promisifyOrganizer(event), promisifyVenue(event)]);
}

function promisifyOrganizer(event) {
  return new Promise(function(resolve, reject) {
    organizers.find({organizerId: event.organizer_id, organizerName: {$exists: true}}, function(err, namedOrganizer) {
      if (namedOrganizer.length > 0) {
        event.organizer_name = namedOrganizer[0].organizerName;
        resolve(event);
      } else {
        organizers.find({organizerId: event.organizer_id, organizerName: {$exists: false}}, function(err, unnamedOrganizer) {
          if (unnamedOrganizer.length > 0) {
            resolve(event);
          } else {
            organizers.insert({organizerId: event.organizer_id});
            resolve(event);
          }
        });
      }
    })
  });
}

function promisifyVenue(event) {
  return new Promise(function(resolve, reject) {
    venues.find({venueId: event.venue_id, venueName: {$exists: true}}, function(err, namedVenue) {
      if (namedVenue.length > 0) {
        event.venue_name = namedVenue[0].venueName;
        resolve(event);
      } else {
        venues.find({venueId: event.venue_id, venueName: {$exists: false}}, function(err, unnamedVenue) {
          if (unnamedVenue.length > 0) {
            resolve(event);
          } else {
            venues.insert({venueId: event.venue_id});
            resolve(event);
          }
        });
      }
    })
  });
}

module.exports = promisifyMongo
