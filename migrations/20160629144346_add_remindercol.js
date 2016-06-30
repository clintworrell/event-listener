
exports.up = function(knex, Promise) {
  return knex.schema.table('users_events', function(table){
    table.boolean('reminder').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users_events', function(table){
      table.dropColumn('reminder');
  });
};
