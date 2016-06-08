'use strict';

import {Router} from 'express';
import controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();
router.param('user', controller.load);

router.post('/', controller.create);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:user', controller.show);
router.put('/:user', controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
