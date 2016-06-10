'use strict';

// LIBRARIES

// SERVICES
import {login} from './auth.service';

// ERRORS
import ApiError from '../../errors/ApiError';
import errors from '../../errors/errors';

class Auth0Controller {
  /**
   * Login against Auth0 api.
   */
  login(req, res, next) {
    //var user = req.body;
    //var ctx = req.ctx;

    res.status(201).json({});
  }
}

var auth0Controller = new Auth0Controller();

export default auth0Controller;
