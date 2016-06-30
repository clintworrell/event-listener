"use strict";

let monk = require('monk'),
    request = require('request'),
    db = monk(process.env.MONGODB_URI),
    token = process.env.EVENTBRITE_PER_OAUTH_TOKEN;

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

function populateOrganizerName() {
  let returnCount = 0;
  organizers.find({"organizerId": {$exists: true}, "organizerName": {$exists: false}}, function(err, unnamedOrganizers) {
    // console.log(unnamedOrganizers);
    let count = ((20 > unnamedOrganizers.length ) ? unnamedOrganizers.length : 20);
    for (var i = 0; i < count; i++) {
      var organizerId = `${unnamedOrganizers[i].organizerId}`;
      console.log(organizerId);
      var organizerApiUrl = `https://www.eventbriteapi.com/v3/organizers/${organizerId}/?token=${token}`;
      console.log(organizerApiUrl);
      request.get(organizerApiUrl, function(err, res, body) {
        body = JSON.parse(body);
        console.log(body.id+ " - " + body.name);
        organizers.update({organizerId: body.id}, {$set: {organizerName: body.name}});
        returnCount++;
        if (returnCount === count) {
          db.close();
        }
      });
    }
  });
}

populateVenueName();
populateOrganizerName();
