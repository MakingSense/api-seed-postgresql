'use strict';

// CONFIG
import config from '../../config/environment/index';

// LIBRARIES
var Promise = require('bluebird');
import _ from 'lodash';
import mandrill from 'mandrill-api/mandrill';
var mandrill_client = new mandrill.Mandrill(config.mandrill.apiKey);

// SERVICES
import UserService from '../../api/user/user.service';

// HELPERS
import EmailHelper from './email.helper';

// UTILS
import Logger from '../../utils/logger';

// ERRORS
import ApiError from '../../errors/ApiError';
import errors from '../../errors/errors';

const templateType = {
  sample: 'sample'
};

function sendTemplate(mandrillMessage) {
  return sendMandrillTemplate(mandrillMessage.template)
    .tap(function(message) {
      Logger.log('info', getLogMessage(mandrillMessage.type, mandrillMessage.data));

      return message;
    })
    .catch(function(err) {
      Logger.log('error', getErrorMessage(mandrillMessage, err));
    });
};

function sendMandrillTemplate(template) {
  return new Promise(function(resolve, reject) {
    mandrill_client.messages.sendTemplate(template, resolve, reject)
  });
};

function getLogMessage(type, data) {
  var logMessage = 'Email sent ';
  var email = '';
  var logData = JSON.stringify(data);

  logMessage = logMessage.concat(` ${email}. Data: ${logData}`);

  return logMessage;
};

/**
 * Get the generic error message
 */
function getErrorMessage(message, err) {
  return ` Error - Sending Mandrill template. Type: ${message.type}. Data ${JSON.stringify(message.data)}. Error details: ${err}`;
};

class EmailService {
  sendSampleEmail(data) {
    //todo: performs validations, get data, prepare template and call to 'sendTemplate' function
  }
}

var emailServiceSingleton = new EmailService();

export default emailServiceSingleton;

