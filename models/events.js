var knex = require('../db/knex');

function EventBriteEvent(config) {
  if(!config) {
    config = {};
  }

  this.name = config.name.text;
  this.url = config.url;
  this.start_time = config.start.local; // utc is available also.
  this.end_time = config.end.local;
  this.organizer_id = config.organizer_id;
  this.organizer_name = null;
  this.venue_id = config.venue_id;
  this.venue_name = null;
  this.description = config.description.text || null;
  this.capacity = config.capacity;
  this.category = config.category_id;
  this.created = config.created;
  this.id = config.id;
  this.status = config.status;
};

function MeetupEvent(config) {
  if(!config) {
    config = {};
  }

  this.name = config.name;
  this.url = config.event_url;
  this.start_time = new Date(config.time);
  this.end_time = config.duration ? new Date(config.time + config.duration) : "N/A";
  this.organizer_name = config.group ? config.group.name : "N/A";
  this.venue_name = config.venue ? config.venue.name : "N/A";
  this.description = config.description;
  this.capacity = config.rsvp_limit;
  this.category = config.group ? config.group.category : "N/A";
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
  EventBriteEvent: EventBriteEvent,
  MeetupEvent: MeetupEvent
};
