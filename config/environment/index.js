'use strict';

import path from 'path';
import _ from 'lodash';
import secrets from './secrets';

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  cors: {
    whitelist: '*'
  },

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  database: {
    host    : secrets.database.host,
    port    : secrets.database.port,
    user    : secrets.database.username,
    password: secrets.database.password,
    database: secrets.database.name,
    ssl     : secrets.database.ssl,
    charset : 'utf8'
  },

  jwt: {
    clientId: secrets.jwt.clientId,
    secret: new Buffer(secrets.jwt.secret || '', 'base64'), // use this to decode tokens
    secretUtf8: secrets.jwt.secret,                         // use this for auth0 strategy
    domain: secrets.jwt.domain,
    auth0ApiToken: secrets.jwt.auth0ApiToken
  },

  mandrill: {
   apiKey: secrets.mandrill.apiKey
  },

  log: {
    logentries:{
      token: secrets.logentries.token,
      level: secrets.logentries.level
    },
    console: {
      level: 'info'
    },
    file:{
      errorFile: process.env.LOG_ERROR_FILE  || path.join(__dirname, '../../log/errors.log'),
      allFile: process.env.LOG_ALL_FILE      || path.join(__dirname, '../../log/all.log'),
      eventFile: process.env.LOG_EVENT_FILE  || path.join(__dirname, '../../log/events.log'),
      level: 'info'
    }
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});
