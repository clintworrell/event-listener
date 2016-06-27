"use strict"
var request = require('request');

function searchEventBriteEvents(keyword, location, radius) {
  let url = `https://www.eventbriteapi.com/v3/events/search/?q=${keyword}&location.address=${location}&location.within=${radius}&token=${process.env.EVENTBRITE_ANON_OAUTH_TOKEN}`;

  return promisifyGet(url)
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


module.exports = searchEventBriteEvents;
