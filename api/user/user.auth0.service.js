'use strict';
import _ from 'lodash';
import Promise from 'bluebird';
import auth0 from 'auth0';
import config from '../../config/environment';

var ManagementClient = auth0.ManagementClient;


class UserAuth0Service {

  constructor() {
    this.managementClient = new ManagementClient({
      domain: config.jwt.domain,
      token: config.jwt.auth0ApiToken
    });
  }

  create(user) {
    if (!user.email || !user.password) {
      return Promise.reject(new Error('Invalid user, must have an email and a password'));
    }
    var userData = _.pick(user, 'email', 'password', 'name');
    userData.connection = 'Username-Password-Authentication';
    return this
      .managementClient
      .users
      .create(userData);
  }
}

const singleton = new UserAuth0Service();

export default singleton;
