'use-strict';

// LIBRARIES
import winston from 'winston';
require('le_node');

import config from '../config/environment/index'


var logLevels = {
  levels: {
    error  : 0,
    warn   : 1,
    info   : 2,
    verbose: 3,
    debug  : 4,
    silly  : 5
  },
  colors: {
    error  : 'red',
    warn   : 'yellow',
    info   : 'cyan',
    verbose: 'black',
    debug  : 'green',
    silly  : 'black'
  }
};

winston.setLevels(logLevels.levels);
winston.addColors(logLevels.colors);

var transports = [];
var exceptionHandlers = [];

if (config.env !== 'test') {
  transports.push(new winston.transports.Console({
    handleExceptions: true,
    json: false,
    colorize: true
  }));
}
// heroku doesn't support to write logs in the server then we'll go to use these only in DEV environment.
if(config.env === 'development'){
  transports.push(new winston.transports.File({name: 'errorLog', colorize: true, timestamp: true, level: 'error', maxsize: 2097152 /* 2MB */, maxFiles: 7, filename: config.log.file.errorFile, handleExceptions: true}));
  transports.push(new winston.transports.File({name: 'everythingLog', colorize: true, timestamp: true, level: config.log.file.level, maxsize: 2097152 /* 2MB */, maxFiles: 5, filename: config.log.file.allFile}));
  transports.push(new winston.transports.File({name: 'eventLog', colorize: true, timestamp: true, level: 'event', maxsize: 2097152 /* 2MB */, maxFiles: 3, filename: config.log.file.eventFile}));

  exceptionHandlers.push(new winston.transports.Console({colorize: true, timestamp: true}));
}

if(config.log.logentries.token){
  transports.push(new winston.transports.Logentries({token:  config.log.logentries.token , level: config.log.logentries.level, json : true}));
  exceptionHandlers.push(new winston.transports.Logentries({token:  config.log.logentries.token , level: config.log.logentries.level, json : true}));
}

var logger = new (winston.Logger)({
  levels           : logLevels.levels,
  transports       : transports,
  exceptionHandlers: exceptionHandlers,
  exitOnError      : false
});

winston.exitOnError = false;

logger.stream = {
  write: function(message, encoding){
    logger.info(message.slice(0, -1));
  }
};

export default logger;



