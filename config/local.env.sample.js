'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'api-seed-postgresql-secret',
  PORT:4000,
  NODE_ENV: 'development',
  DB_NAME: 'api-seed-test-0',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_USER: '',
  DB_PASSWORD: '12345678',
  JWT_DOMAIN: '',
  JWT_AUDIENCE: '',
  JWT_SECRET: '',
  MANDRILL_API_KEY: '',
  LOGENTRIES_TOKEN: '',
  LOGENTRIES_LEVEL: 'info',
  DEBUG: ''
};
