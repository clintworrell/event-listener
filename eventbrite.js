"use strict"
var request = require('request');
var Events = require('./models/events');

var keyword = 'hackathon';

searchEventBriteEvents();

function searchEventBriteEvents() {
  let url = `https://www.eventbriteapi.com/v3/events/search/?q=${keyword}&location.address=san+francisco&location.within=10mi&token=A74LOHAEAJPPXY2S4MJK`;

  request(url, function(err, res, body) {
    body = JSON.parse(body);
    // console.log(body.events[0]);
    let events = body.events.map(function(event) {
      return new Events(event);
    });
    console.log("events saved ============")
    console.log(events);

    events.forEach(function(event) {
      event.insert();
    })
  });

}
