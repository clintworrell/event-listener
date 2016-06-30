"use strict";

let MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    assert = require('assert'),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/test');

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

// organizers.update({organizerId: "10011042164"}, {$set: {organizerName: "International Monetary Fund"}});
// organizers.update({organizerId: "7052835663"}, {$set: {organizerName: "World Wildlife Fund"}});
// organizers.update({organizerId: "10882074003"}, {$set: {organizerName: "World Health Organization"}});
// organizers.update({organizerId: "7488486017"}, {$set: {organizerName: "United Nations Children’s Fund (UNICEF)"}});
// organizers.update({organizerId: "8380680968"}, {$set: {organizerName: "UNESCO"}});
// organizers.update({organizerId: "299420373"}, {$set: {organizerName: "World Bank"}});
// organizers.update({organizerId: "4267538111"}, {$set: {organizerName: "World Trade Organization"}});
// organizers.update({organizerId: "299420373"}, {$set: {organizerName: "Group of 8"}});
// organizers.update({organizerId: "10825985110"}, {$set: {organizerName: "United Nations"}});
// organizers.update({organizerId: "299420373"}, {$set: {organizerName: "North Atlantic Treaty Organization"}});
//
// venues.update({venueId: "13884056"}, {$set: {venueName: "Bowery Ballroom"}});
// venues.update({venueId: "15683449"}, {$set: {venueName: "Café du Nord"}});
// venues.update({venueId: "15699021"}, {$set: {venueName: "Crocodile Café"}});
// venues.update({venueId: "15823164"}, {$set: {venueName: "Department of Safety"}});
// venues.update({venueId: "15405200"}, {$set: {venueName: "Doug Fir Lounge"}});
// venues.update({venueId: "15797369"}, {$set: {venueName: "The Fillmore"}});
// venues.update({venueId: "15735527"}, {$set: {venueName: "Tractor Tavern"}});
// venues.update({venueId: "15728353"}, {$set: {venueName: "Gorge Ampitheater"}});
// venues.update({venueId: "15519396"}, {$set: {venueName: "Great American Music Hal"}});
// venues.update({venueId: "14150503"}, {$set: {venueName: "The Troubadour"}});

module.exports = promisifyMongo
