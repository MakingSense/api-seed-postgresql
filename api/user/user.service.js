import _ from 'lodash';
import Promise from 'bluebird';

import BaseService from '../base.service';
import User from './user.model';
import Role from './role.model';
import UserAuth0Service from './user.auth0.service';

// ERRORS
import ApiError from '../../errors/ApiError';
import errors from '../../errors/errors';

// HELPERS
import {validations, validationsToUpdate, userValidations} from '../../utils/validations.helper';

// UTILS
import Logger from '../../utils/logger';

const SANITIZE_FIELDS = ['firstName', 'lastName', 'phone', 'email', 'password'];

function sanitize(user) {
  return _.pick(_.cloneDeep(user), SANITIZE_FIELDS);
}

function sanitizeByAdmin(user) {
  return _.pick(_.cloneDeep(user), SANITIZE_FIELDS.concat(['role', 'status']));
}

function validate(user) {
  // firstly check common validations.
  var error = validations(user);

  if (error) {
    return error;
  }

  // later user validations.
  return userValidations(user);
}

function validateUpdate(user) {
  // firstly check common validations.
  var error = validationsToUpdate(user);

  if (error) {
    return error;
  }

  // later user validations.
  return userValidations(user);
}

function getErrorLogToRemoveAuth0(auth0UserId, err) {
  return ('error', `Auth0 - Dashboard - activity - DELETE. Auth0 User identifier "${auth0UserId}"`, err);
}

function isRequesterAdmin(requester) {
  return (requester.isAdmin || requester.role === 'admin');
}

function checkEmailAvailableToCreate(email) {
  email = email.trim().toLowerCase();

  return User
    .where('email', email)
    .fetchAll()
    .then(users => {
      return users.toJSON().length === 0;
    });
}

function checkEmailAvailableToUpdate(email, id) {
  if (!email) {
    return Promise.resolve({'valid': true});
  }

  email = email.trim().toLowerCase();

  return User
    .where('email', email)
    .where('id', '<>', id)
    .fetchAll()
    .then(users => {
      return users.toJSON().length === 0;
    });
}

class UserService extends BaseService {

  constructor() {
    super(User);
  }

  findById(id) {
      return User
        .where('id', id)
        .fetch({withRelated: ['role']})
        .then(user => user && user.toJSON());
  }

  findByAuth0Id(id) {
    return User
      .where('auth0Id', id)
      .fetch({withRelated: ['role']})
      .then(user => user && user.toJSON());
  }

  findByEmail(email) {
    return User
      .where('email', email)
      .fetch({withRelated: ['role', 'identities']})
      .then(user => user && user.toJSON());
  }

  findAll() {
    return User
      .where('status', 'active')
      .fetchAll({withRelated: ['role']})
      .then(models => models && models.toJSON());
  }

  update(user, changes, ctx = {}) {
    var requester = ctx.requester;

    if (requester.status && requester.status !== 'active') {
      return Promise.reject(new ApiError(errors.forbidden_403.user_permission_denied));
    }

    changes = isRequesterAdmin(requester) ? sanitizeByAdmin(changes) : sanitize(changes);

    if (changes.brokerVerificationId) {
      user.type = 'broker';
    }

    user = _.omit(user, 'role');

    var hasError = validateUpdate(changes);
    if (hasError) {
      return Promise.reject(hasError);
    }

    return checkEmailAvailableToUpdate(changes.email, user.id)
      .then(res=> {
        if (!res) {
          return Promise.reject(new ApiError(errors.bad_request_400.user_email_used));
        }

        return super
          .update(user, changes)
          .tap(user => Logger.log('info', `[SERVICE] [USER] User with id: ${user.id} has been updated`, {changes}))
          .then(user => this.findById(user.id))
          .catch(function(err) {
            Logger.log('error', `[SERVICE] [USER] Error updating User with id: ${user.id}`, {err, ctx});
            return Promise.reject(new ApiError(errors.internal_server_error_500.server_error, null, err));
          });
      });
  }

  create(newUser, ctx = {}) {
    newUser = sanitize(newUser);
    newUser.roleId = 2; //user
    newUser.status = 'active';

    var hasError = validate(newUser);
    if (hasError) {
      return Promise.reject(hasError);
    }

    return checkEmailAvailableToCreate(newUser.email)
      .then(res => {
        if (!res) {
          return Promise.reject(new ApiError(errors.bad_request_400.user_email_used));
        }

        return UserAuth0Service
          .create(newUser).then(res => {
            // remove this attribute because the authentication will be handle for auth0.
            delete newUser.password;
            newUser.auth0Id = res.user_id;

            const user = User.forge(newUser);

            return user
              .save()
              .then(user => user.toJSON())
              .tap(user => Logger.log('info', `[SERVICE] [USER] User with id: ${user.id} has been created`, {
                user,
                ctx
              }))
              .catch(function(err) {
                Logger.log('error', `[SERVICE] [USER] Error creating User`, {err, ctx, user});
                return Promise.reject(new ApiError(errors.internal_server_error_500.server_error, null, err));
              });

          })
          .catch(err=> {
            var error = _.cloneDeep(new ApiError(errors.bad_request_400.user_auth0_integration));
            error.message = error.message.concat(`Details here: ${err.message}`);

            return Promise.reject(error);
          });
      });
  }

  delete(id, ctx = {}) {
    var requester = ctx.requester || {};

    if (requester.status && requester.status !== 'active') {
      return Promise.reject(new ApiError(errors.forbidden_403.user_permission_denied));
    }

    if (!id) {
      return Promise.reject(new ApiError(errors.bad_request_400.user_already_signed_up));
    }

    this.findById(id)
      .then(user=> {
        return this.update(user, {'status': 'inactive'}, ctx)
          .tap(user => {
            Logger.log('info', `[SERVICE] [USER] User with id: ${user.id} has been set as inactive`)
          })
          .catch(function (err) {
            Logger.log('error', `[SERVICE] [USER] Error trying to set inactive User with id: ${user.id}`, {
              err,
              ctx
            });

            return Promise.reject(new ApiError(errors.internal_server_error_500.server_error, null, err));
          });
      });
  }

  removeUserByAuth0Id(auth0UserId, ctx) {
    var self = this;

    if (!auth0UserId) {
      Logger.log('info', ('[Service] [User] [Auth0] Dashboard activity: DELETE. User identifier invalid'));
      return Promise.resolve({'received': 'OK'});
    }

    return this.findByAuth0Id(auth0UserId)
      .then(function(user) {
        if (!user) {
          Logger.log('info', `[Service] [User] [Auth0] Dashboard Activity: DELETE. User with identifier: ${auth0UserId} does not exist in our database`, {ctx});
          return Promise.resolve({'received': 'OK'});
        }

        ctx.requester = {
          role: 'admin',
          status: 'active',
          type: 'external-Auth0'
        };

        return self.delete(user.id, ctx)
          .then(()=> {
            Logger.log('info', `[Service] [User] [Auth0] Dashboard Activity: DELETE. User with identifier: ${auth0UserId} has been deleted`, {ctx});
            return Promise.resolve({'received': 'OK'});
          });
      })
      .catch(function(err) {
        Logger.log(getErrorLogToRemoveAuth0(auth0UserId, err));
        return Promise.resolve({'received': 'OK'});
      });
  }
}

var userServiceSingleton = new UserService();

export default userServiceSingleton;
