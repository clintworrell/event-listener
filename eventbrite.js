"use strict"
var request = require('request');
var Events = require('./models/events');

var keyword = 'hackathon';
var location = 'san francisco';
var radius = '10mi';
var token = 'A74LOHAEAJPPXY2S4MJK';
// var token = process.env.EVENTBRITE_ANON_OAUTH_TOKEN;

searchEventBriteEvents();

function searchEventBriteEvents() {
  let url = `https://www.eventbriteapi.com/v3/events/search/?q=${keyword}&location.address=${location}&location.within=${radius}&token=${token}`;

  request.get(url, function(err, res, body) {
    body = JSON.parse(body);
    // console.log(body.events[0]);
    let events = body.events.map(function(event) {
      return new Events(event);
    });
    console.log("events saved ============")
    console.log(events);

    // events.forEach(function(event) {
    //   event.insert();
    // });
  });

}
