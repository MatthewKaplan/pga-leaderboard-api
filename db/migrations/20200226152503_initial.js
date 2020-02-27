
exports.up = function(knex) {
  return knex.schema
    .createTable('players', function (table) {
        table.increments('id').primary();
        table.string('first_name');
        table.string('last_name');
        table.string('score');

        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('players')
};
