/**
 * Express configuration
 */

'use strict';

import express from 'express';
import morgan from 'morgan';
import uuid from 'node-uuid';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import config from './environment';
//import passport from 'passport';
import Logger from '../utils/logger';

function generateRequestId() {
  return uuid.v4();
}

morgan.token('id', function getId(req) {
  return req.requestId;
});

export default function(app) {
  var loggingFormat = '[RES] [:method] :url :status [:id] :response-time ms - :res[content-length]';
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(function(req, res, next) {
    var source = 'API';
    var requestId = req.headers['x-request-id'] || generateRequestId();
    req.requestId = requestId;
    req.ctx = {requestId, source};
    next();
  });

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  //app.use(passport.initialize());

  //app.set('appPath', path.join(config.root, 'client'));

  if ('production' === env || 'staging' === env) {
    // app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    //app.use(express.static(app.get('appPath')));
    app.use(morgan(loggingFormat, {stream: Logger.stream}));
  }

  if ('development' === env) {
    app.use(require('connect-livereload')());
    app.use(morgan(loggingFormat, {stream: Logger.stream}));
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    //app.use(express.static(app.get('appPath')));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
