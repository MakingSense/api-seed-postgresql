'use strict';

import app from '../../..';
import {knex} from '../../base.model.js';
import User from './../user.model.js';

var user;

var genUser = function() {
  user = new User({
    firstName: 'User',
    lastName: 'Test',
    email: 'test@test.org'
  });

  return user;
};

describe('[Model] [Users]', function() {
  beforeEach(genUser);

  afterEach(function() {
    return knex('users').del();
  });

  it('should begin with no users', function() {
    var allUsers = User.fetchAll();
    allUsers.then(function(users) {
      return users.toJSON();
    });
    return expect(allUsers).to.eventually.have.length(0);
  });

  it('should allow you to save a user with minimal information', function() {
    var allUsers = user
      .save()
      .then(function() {
        return User.fetchAll();
      })
      .then(users => users.toJSON());

    return expect(allUsers).to.eventually.have.length(1);
  });

  it('should fail when saving a duplicate user', function() {
    var duplicates = user
      .save()
      .then(function() {
        var userDup = genUser();
        return userDup.save();
      });

    return expect(duplicates).to.be.rejected;
  });

  describe('#email', function() {
    it('should not allow you to save a user without an email', function() {
      user.email = '';
      return user
        .save()
        .then(function() {
          throw new Error('Should not save user without an email');
        })
        .catch(function(err) {
          expect(err.errors.email).to.exist;
        });
    });

    it('should not allow you to save a user with an invalid email', function() {
      user.email = 'my@';
      return user
        .save()
        .then(function() {
          throw new Error('Should not save user without an email');
        })
        .catch(function(err) {
          expect(err.errors.email).to.exist;
        });
    });
  });

  describe('#name', function() {
    it('should not allow you to save a user without a name', function() {
      user.firstName = '';

      return user
        .save()
        .then(function() {
          throw new Error('Should not save user without a firstName');
        })
        .catch(function(err) {
          expect(err.errors).to.exist;
        });
    });
  });
});
