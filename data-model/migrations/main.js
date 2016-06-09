exports.up = function(knex) {
  return knex
    .schema
    .createTable('roles', function(table) {
      table.increments();
      table.text('name');
    })
    .then(function() {
      return knex.schema.createTable('users', function(table) {
        table.increments();
        table.integer('role_id').references('roles.id');
        table.text('first_name').notNullable();
        table.text('last_name').notNullable();
        table.text('email').unique().notNullable();
        table.text('phone');
        table.enu('status', ['active', 'inactive', 'blocked']);
        table.timestamps();
        table.text('auth_0_id');
      });
    })
};

exports.down = function(knex, Promise) {
  var tablesToDrop = [
    'users',
    'roles'
  ];

  return Promise.each(tablesToDrop, function(tableName) {
    return knex.schema.dropTableIfExists(tableName);
  });
};
