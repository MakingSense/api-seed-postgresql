'use strict';

import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import {Router} from 'express';
import controller from './user.controller';
import * as auth from '../auth/auth.service';

// MIDDLEWARE
import tokenChecker from '../../middleware/tokenChecker';
const authMiddleware = [expressJwt({secret: config.jwt.secret}), tokenChecker];

var router = new Router();
router.param('user', controller.load);

router.post('/', controller.create);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:user', authMiddleware, controller.show);
router.put('/:user', controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
