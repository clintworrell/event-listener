
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_events').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users_events').insert({user_id: '2', event_id: '1'}),
        knex('users_events').insert({user_id: '4', event_id: '1'}),
        knex('users_events').insert({user_id: '3', event_id: '3'}),
        knex('users_events').insert({user_id: '4', event_id: '2'}),
        knex('users_events').insert({user_id: '4', event_id: '2'})
      ]);
    });
};
