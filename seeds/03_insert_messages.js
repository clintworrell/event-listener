
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('messages').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('messages').insert({
          sender: 1,
          receiver: 2,
          subject: 'Hey, check out this awesome event!',
          body: 'Go to https://shape.att.com/ for more information.'})
      ]);
    });
};
