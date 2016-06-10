'use strict';

import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import {Router} from 'express';
import controller from './user.controller';
import * as auth from '../auth/auth.service';

var router = new Router();

router.post('/', controller.create);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:user', auth.loadAndEnforceAuthentication(), controller.show);
router.put('/:user', auth.loadAndEnforceAuthentication(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
