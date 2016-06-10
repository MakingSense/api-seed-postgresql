'use strict';

import {Router} from 'express';
import controller from './auth.controller';

var router = new Router();

router.post('/login', controller.login());

export default router;
