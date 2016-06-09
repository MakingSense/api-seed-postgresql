/**
 * Main application routes
 */

'use strict';

// UTILS
import Logger from './utils/logger';
import morgan from 'morgan';

export default function(app) {
  app.use(require('./api/cors.with.options'));
  app.use(morgan('[REQ] [:method] :url [:id]', {immediate: true, stream: Logger.stream}));

  app.use(function(req, res, next) {
    var body = req.body || {};
    var ctx = req.ctx || {};
    Logger.log('debug', '[REQ] body', {body, ctx});
    next();
  });

  // Insert routes below
  app.get('/ping', (req, res) => res.send());
  //app.use('/externals', require('./api/external'));
  app.use('/api', require('./api'));

  app.use(function(err, req, res, next) {
    var ctx = req.ctx;
    Logger.log('error', `[HTTP] [API] [${err.status || 500}] Request with error.`, {err, ctx});
    next(err);
  });


  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      var ctx = req.ctx || {};
      res.status(err.status || 500);
      res.json({
        requestId: ctx.requestId,
        message: err.message,
        error: err
      });
    });

  } else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {

      var ctx = req.ctx;
      res.status(err.status || 500);
      res.json({
        requestId: ctx.requestId,
        message: err.message
      });
    });
  }

}
