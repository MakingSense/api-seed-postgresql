'use strict';
import secrets from './secrets';
// Test specific configuration
// ===========================
var conf = {
  database: {
    host: secrets.database.host,
    port: secrets.database.port,
    user: secrets.database.username,
    password: secrets.database.password,
    database: process.env.DB_TEST_NAME || secrets.database.name,
    charset: 'utf8'
  },

  salesApi: {
    url: 'https://origin-staging.wework.com/api/v1'
  }
};

export default conf;
