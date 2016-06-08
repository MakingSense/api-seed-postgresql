
// USE THIS FILE TO ADD YOUR CREDENTIALS FOR DATABASES, BUT NEVER EVER EVER CHECK THEM INTO VERSION CONTROL.
// THAT'S A BAD THING. TO IGNORE LOCAL CHANGES WITH THIS COMMAND:
// git update-index --assume-unchanged data-model/knexfile.js

module.exports = {

  development: {
    client    : 'postgresql',
    connection: {
      host    : 'localhost',
      database: 'api-seed-dev',
      user    : 'webapp',
      password: 'test123'
    },
    pool      : {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  test: {
    client    : 'postgresql',
    connection: {
      host    : 'localhost',
      database: 'api-seed-test-0',
      user    : 'webapp',
      password: 'test123'
    },
    pool      : {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  stage: {

  },

  production: {

  }

};
