'use strict';

import Logger from './../logger';

describe('[Util] [Logger]', function() {

  it('should create a simple error log', function() {
    Logger.log('error', 'simple error test message');
  });

  it('should create a simple info log', function() {
    Logger.log('info', 'simple info test message');
  });

});
