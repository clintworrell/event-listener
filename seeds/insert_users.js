
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({username: 'clintworrell', password: 'pass1', firstname: 'Clint', lastname: 'Worrell', email: 'clint@example.com'}),
        knex('users').insert({username: 'd', password: 'pass2', firstname: 'Dai', lastname: 'Nguyen', email: 'dai@example.com'}),
        knex('users').insert({username: 'tuhmaytow', password: 'pass3', firstname: 'Nica', lastname: 'Lazatin', email: 'nica@example.com'}),
        knex('users').insert({username: 'winniekwon', password: 'pass4', firstname: 'Winnie', lastname: 'Kwon', email: 'winnie@example.com'})
      ]);
    });
};
