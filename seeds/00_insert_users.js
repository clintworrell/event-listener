"use strict";

let bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({username: 'clintworrell', password: bcrypt.hashSync("pass1", 10), firstname: 'Clint', lastname: 'Worrell', email: 'clint.worrell@gmail.com'}),
        knex('users').insert({username: 'd', password: bcrypt.hashSync("pass2", 10), firstname: 'Dai', lastname: 'Nguyen', email: 'dainguyen@gmail.com'}),
        knex('users').insert({username: 'tuhmaytow', password: bcrypt.hashSync("pass3", 10), firstname: 'Nica', lastname: 'Lazatin', email: 'tuhmaytow@gmail.com'}),
        knex('users').insert({username: 'winniekwon', password: bcrypt.hashSync("pass4", 10), firstname: 'Winnie', lastname: 'Kwon', email: 'heladolk@yahoo.com'})
      ]);
    });
};
