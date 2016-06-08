'use strict';

import express from 'express';
import config from '../config/environment';
import UserService from '../api/user/user.service';

// Passport Configuration
//require('./id/id.passport').setup(UserService, config);
//require('./auth0/auth0.passport').setup(UserService, config);

var router = express.Router();

//router.use('/id', require('./id/id.routes').default);
router.use('/auth0', require('./auth0/auth0.routes').default);

export default router;
