"use strict";

import cors from 'cors';
import config from '../config/environment';

var whitelist = config.cors.whitelist;

if (whitelist == '*') {
  module.exports = cors();
} else {
  var corsOptions = {
    origin: function (origin, callback) {
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  };

  module.exports = cors(corsOptions);
}
