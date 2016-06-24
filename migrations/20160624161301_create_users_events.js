exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_events', function(table){
    table.increments();
    table.integer('user_id').references('users.id').notNullable();
    table.integer('event_id').references('events.id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_events');
};
