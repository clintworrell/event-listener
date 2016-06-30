"use strict";

require("dotenv").load();

let MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    assert = require('assert'),
    mongo = require('mongodb'),
    monk = require('monk'),
    request = require('request'),
    db = monk('localhost:27017/test'),
    token = process.env.EVENTBRITE_PERSONAL_OAUTH_TOKEN;

let organizers = db.get('organizers');
let venues = db.get('venues');

function populateVenueName() {
  let returnCount = 0;
  venues.find({"venueId": {$exists: true}, "venueName": {$exists: false}}, function(err, unnamedVenues) {
    let count = ((20 > unnamedVenues.length ) ? unnamedVenues.length : 20);
    for (var i = 0; i < count; i++) {
      var venueId = `${unnamedVenues[i].venueId}`;
      var venueApiUrl = `https://www.eventbriteapi.com/v3/venues/${venueId}/?token=${token}`;
      console.log(venueApiUrl);
      request.get(venueApiUrl, function(err, res, body) {
        body = JSON.parse(body);
        console.log(body.name);
        venues.update({venueId: body.id}, {$set: {venueName: body.name}});
        returnCount++;
        if (returnCount === count) {
          db.close();
        }
      });
    }
  });
}

populateVenueName();
