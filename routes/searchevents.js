"use strict"
var request = require('request');

function searchEventBriteEvents(keyword, location, radius) {
  let url = `https://www.eventbriteapi.com/v3/events/search/?q=${keyword}&location.address=${location}&location.within=${radius}&token=${process.env.EVENTBRITE_ANON_OAUTH_TOKEN}`;

  return promisifyGet(url);
}

function searchMeetupEvents(topic, city, radius, latitude, longitude) {
  let url;
  if(latitude && longitude) {
    url = `https://api.meetup.com/2/open_events?key=${process.env.MEETUP_API_KEY}&status=upcoming&page=15&lat=${latitude}&lon=${longitude}&radius=${radius}&sign=true`;
  } else {
    url = `https://api.meetup.com/2/open_events?key=${process.env.MEETUP_API_KEY}&status=upcoming&topic=${topic}&city=${city}&radius=${radius}&sign=true`;
  }

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

function parseDate(eventTime) {
  if (eventTime) {
    let timeString = eventTime.toString();
    let dateArr = timeString.split(" ");
    let month = dateArr[1];
    let date = dateArr[2];
    let year = dateArr[3];
    let time = dateArr[4];
    let timeArr = time.split(":");
    let hours = timeArr[0];
    let minutes = timeArr[1];
    if (hours > 12) {
      hours -= 12;
      minutes = minutes + " PM";
    } else {
      minutes = minutes + " AM";
    }
    return `${month} ${date} ${year}, ${hours}:${minutes}`;
  }
}

module.exports = {
  searchEventBriteEvents: searchEventBriteEvents,
  searchMeetupEvents: searchMeetupEvents,
  parseDate: parseDate
};
