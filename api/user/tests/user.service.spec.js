'use strict';

import app from '../../..';
import UserService from './../user.service.js';
import {knex} from '../../base.model.js';

var user, requestUser;
function genUser() {
  user = {
    firstName: 'User',
    lastName: 'Test',
    email: getRandomEmail(),
    password: '123456'
  };

  return user;
};

function getRandomEmail(){
  return `${Math.random().toString(36).substring(7)}@test.com`;
};

describe('[Service] [Users]', function() {

  this.timeout(10000);

  beforeEach(genUser);

  afterEach(function clearDatabase() {
    return knex('users').del();
  });

  it('should create users', function() {
    var allUsers = UserService
      .create(user)
      .then(function() {
        return UserService.findAll();
      });

    return expect(allUsers).to.eventually.have.length(1);
  });

  it('should create users with a phone number valid', function() {
    user.phone = '+1 650-253-0000';

    var allUsers = UserService
      .create(user)
      .then(function() {
        return UserService.findAll();
      });
    return expect(allUsers).to.eventually.have.length(1);
  });

  it('should not allow you to create users without a valid email', function() {
    delete user.email;
    return UserService
      .create(user)
      .then(() => {
        throw new Error('should not have saved user')
      })
      .catch(err => UserService.findAll())
      .then(users => expect(users).to.have.length(0));
  });

  it('should not allow you to create users without a first name', function() {
    delete user.firstName;

    return UserService
      .create(user)
      .then(() => {
        throw new Error('should not have saved user')
      })
      .catch(err => UserService.findAll())
      .then(users => expect(users).to.have.length(0));
  });

  it('should not allow you to create users with a phone number < 2 chars', function() {
    user.phone = '1';

    return UserService
      .create(user)
      .then(() => {
        throw new Error('should not have saved user')
      })
      .catch(err => UserService.findAll())
      .then(users => expect(users).to.have.length(0));
  });

  it('should not allow you to create users with a phone number > 45 chars', function() {
    user.phone = '12300029291929394944 292929291 939393333333 9944494949494949494900000';

    return UserService
      .create(user)
      .then(() => {
        throw new Error('should not have saved user')
      })
      .catch(err => UserService.findAll())
      .then(users => expect(users).to.have.length(0));
  });

});
