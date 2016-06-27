var knex = require('../db/knex');

function eventBriteEvent(config) {
  if(!config) {
    config = {};
  }

  this.name = config.name.text;
  this.url = config.url;
  this.start_time = config.start.local; // utc is available also.
  this.end_time = config.end.local;
  this.group_name = config.organizer_id;
  this.venue = config.venue_id;
  this.description = config.description.text || null;
  this.capacity = config.capacity;
  this.category = config.category_id;
  this.created = config.created;
  this.id = config.id;
  this.status = config.status;
};

function meetupEvent(config) {
  if(!config) {
    config = {};
  }

  this.name = config.name;
  this.url = config.event_url;
  this.start_time = new Date(config.time);
  this.end_time = !config.duration ? 'none provided' : new Date(config.time + config.duration);
  this.group_name = config.group.name;
  this.venue = config.venue.name;
  this.description = config.description;
  this.capacity = config.rsvp_limit;
  this.category = config.group.category || null;
  this.created = new Date(config.created);
  this.id = config.id;
  this.status = config.status;
}

// Events.prototype.insert = function() {
//   knex('events').insert({
//     name: this.name,
//     url: this.url,
//     start_time: this.start_time,
//     end_time: this.end_time,
//     group_name: this.group_name,
//     venue: this.venue
//   }).returning('*')
//   .then(function(data) {
//     console.log(data);
//   })
//   .catch(function(error) {
//     console.log(error);
//   })
// }

module.exports = {
  eventBriteEvent: eventBriteEvent,
  meetupEvent: meetupEvent
};
