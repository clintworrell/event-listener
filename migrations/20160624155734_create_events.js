
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', function(table){
    table.increments();
    table.string('name');
    table.string('url');
    table.timestamp('start_time');
    table.timestamp('end_time');
    table.string('group_name');
    table.string('venue');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('events');
};
