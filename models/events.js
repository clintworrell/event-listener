var knex = require('../db/knex');

function Events(config) {
  if(!config) {
    config = {}
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

module.exports = Events;
