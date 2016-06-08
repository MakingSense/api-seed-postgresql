'use strict';

import qs from 'querystring';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import UserService from '../api/user/user.service';
import Logger from '../utils/logger';
import ApiError from '../errors/ApiError';
import errors from '../errors/errors';

var validateJwt = expressJwt({
  secret: config.jwt.secret,
  credentialsRequired: false
});

var validateAndEnforceJwt = expressJwt({
  secret: config.jwt.secret
});

export function loadToken() {
  // Validate jwt
  return compose()
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    });
}

var isAuth0Token = function(decodedToken) {
  if (!decodedToken) {
    return false
  }
  return decodedToken.aud === config.jwt.clientId;
};

export function loadUser() {
  return loadToken()
    .use(function(req, res, next) {
      var userPromise;
      req.token = req.user;

      if (!req.user) {
        return next();
      }

      userPromise = isAuth0Token(req.user) ? UserService.findByAuth0Id(req.user.sub) : UserService.findById(req.user.id);

      return userPromise.then(function(user) {
        req.user = user;
        next();
      })
        .catch(next);
    })
}

export function loadAndEnforceAuthentication() {
  return compose()
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateAndEnforceJwt(req, res, next);
    })
    .use(function(req, res, next) {
      var id, userPromise;
      var dtoken = req.user;

      userPromise = isAuth0Token(req.user) ? UserService.findByAuth0Id(req.user.sub) : UserService.findById(req.user.id);

      return userPromise.then(function(user) {

        if (user && user.status !== 'active' && dtoken.role !== 'admin') {
          throw new ApiError(errors.forbidden_403.user_is_inactive);
        }

        req.user = user;
        req.token = dtoken;
        next();
      })
        .catch(next);
    });
}

export function isRegistered() {
  return compose()
    .use(function(req, res, next) {
      var token = req.token;
      var isRegistered = !!req.user;
      var isAdmin = token.role === 'admin';
      var err = new Error('UNAUTHORIZED');
      err.status = 403;

      return isRegistered || isAdmin? next() : next(err);
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(function meetsRequirements(req, res, next) {
      var {ctx, token, user} = req;
      var role = user ? user.role.name : token.role;
      if (role !== roleRequired) {
        Logger.log('warn', `User performed an unauthorized request`, {ctx, role, token, user});
        var err = new Error('UNAUTHORIZED');
        err.status = 403;
        return next(err);
      }

      next();
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken({id, role, name}) {
  return jwt.sign({id, role: role.name || role, name}, config.jwt.secret, {
    expiresIn: 60 * 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  var parsedState = req.query.state ? qs.parse(req.query.state) : {};
  var redirectTo = parsedState.redirect_to;
  if (!req.user) {
    var message = "It looks like you aren't logged in, please try again.";
    return res.status(404).json({message});
  }
  var token = signToken(req.user);
  res.cookie(config.id.tokenCookieName, token, {domain: config.id.redirectDomain});
  res.redirect(redirectTo || config.id.redirectUrl || '/');
}
