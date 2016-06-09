import auth0 from 'auth0';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';

var AuthenticationClient = auth0.AuthenticationClient;
var ManagementClient = auth0.ManagementClient;

class Auth0Facade {

  constructor() {
    this.auth0 = new AuthenticationClient({
      domain: config.jwt.domain,
      clientId: config.jwt.clientId
    });
    this.auth0Management = new ManagementClient({
      domain: config.jwt.domain,
      token: config.jwt.auth0ApiToken
    });
  }

  login(email, password) {
    return this
      .auth0
      .database
      .signIn({
        username: email,
        password: password,
        scope: 'openid email name picture'
      });
  }

  getUserInfo(id) {
    return this
      .auth0Management
      .users
      .get({id: id});
  }

  decodeToken(jwtToken) {
    return jwt.decode(jwtToken);
  }
}

var auth0Facade = new Auth0Facade();

export default auth0Facade;
