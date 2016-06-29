
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('events').insert({
          name: 'Shape: An AT&T Tech Expo',
          url: 'https://shape.att.com/',
          start_time: 'June 29 03:00 2016 PST',
          end_time: 'June 29 07:30 2016 PST',
          group_name: 'AT&T',
          venue: 'AT&T Park'}),
        knex('events').insert({
          name: 'Galvanize: How to Use Data to Optimize & Grow Your Business',
          url: 'https://www.eventbrite.com/e/galvanize-how-to-use-data-to-optimize-grow-your-business-tickets-26249454826',
          start_time: 'July 12 12:30 2016 PST',
          end_time: 'July 12 01:30 2016 PST',
          organizer_name: 'Galvanize',
          venue_name: 'Galvanize SF'}),
        knex('events').insert({
          name: 'Multisensory Music Hackathon',
          url: 'http://monthlymusichackathon.org/',
          start_time: 'July 9 12:00 2016 EST',
          end_time: 'July 9 22:00 2016 EST',
          organizer_name: 'Multisensory Music Hackathon',
          venue_name: 'Spotify NY'})
      ]);
    });
};
