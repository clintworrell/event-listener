
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.text('username').notNullable().unique();
    table.text('password');
    table.text('firstname');
    table.text('lastname');
    table.string('email').unique();
    // table.text('city');
    // table.text('state');
    // table.number('search-radius');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
