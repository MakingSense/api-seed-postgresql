'use strict';

import express from 'express';
import config from './config/environment';
import http from 'http';

// Populate databases with sample data
if (config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = http.createServer(app);

require('./config/express').default(app);
require('./routes.js').default(app);

// Start server
function startServer() {
  app.apiInstance = server.listen(config.port, config.ip, function() {
    console.log(`Express server listening on ${config.port}, in ${app.get('env')} mode using database: ${config.database.database}`);
  });
}

startServer();

// Expose app
export default app;
