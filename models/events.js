var knex = require('../db/knex');

function EventBriteEvent(config) {
  if(!config) {
    config = {};
  }

  this.name = config.name.text;
  this.url = config.url;
  this.start_time = new Date(config.start.utc); // utc is available also.
  this.end_time = new Date(config.end.utc);
  this.organizer_id = config.organizer_id;
  this.organizer_name = config.organizer_id // update this to organizer name eventually;
  this.venue_id = config.venue_id;
  this.venue_name = config.venue_id // update this to venue name eventually;
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
  this.end_time = config.duration ? new Date(config.time + config.duration) : null;
  this.organizer_name = config.group ? config.group.name : null;
  this.venue_name = config.venue ? config.venue.name : null;
  this.description = config.description;
  this.capacity = config.rsvp_limit;
  this.category = config.group ? config.group.category : null;
  this.created = new Date(config.created);
  this.id = config.id;
  this.status = config.status;
}

module.exports = {
  EventBriteEvent: EventBriteEvent,
  MeetupEvent: MeetupEvent
};
