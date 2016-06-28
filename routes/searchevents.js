"use strict"
var request = require('request');

function searchEventBriteEvents(keyword, location, radius) {
  let url = `https://www.eventbriteapi.com/v3/events/search/?q=${keyword}&location.address=${location}&location.within=${radius}&token=${process.env.EVENTBRITE_ANON_OAUTH_TOKEN}`;

  return promisifyGet(url);
}

function searchMeetupEvents(topic, city, radius) {
  let url = `https://api.meetup.com/2/open_events?key=${process.env.MEETUP_API_KEY}&topic=${topic}&city=${city}&radius=${radius}&sign=true`;

  return promisifyGet(url);
}

function promisifyGet(url) {
    return new Promise(function(resolve, reject) {
        request.get(url, function(error, response, body){
            if(error) {
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
}


module.exports = {
  searchEventBriteEvents: searchEventBriteEvents,
  searchMeetupEvents: searchMeetupEvents
};
