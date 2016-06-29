
exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function(table){
    table.increments();
    table.integer('sender').references('users.id').notNullable();
    table.integer('receiver').references('users.id').notNullable();
    table.string('subject').notNullable();
    table.text('body').notNullable();
    table.timestamp('date').defaultTo(knex.fn.now());
    table.boolean('read').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
