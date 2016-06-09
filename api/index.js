'use strict';

import {Router} from 'express';

var router = new Router();

router.use((req, res, next) => {
  var requester = req.user && req.user.role ? req.user : null;
  req.ctx.requester = requester;
  next();
});

router.use('/users', require('./user'));

module.exports = router;
