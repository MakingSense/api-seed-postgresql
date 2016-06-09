"use strict";

// LIBRARIES
import Promise from 'bluebird';
import _ from 'lodash';

// BASE MODEL
import bookshelf from '../base.model';

var Fields = require('bookshelf-schema/lib/fields');
var Relations = require('bookshelf-schema/lib/relations');
var belongsTo = Relations.BelongsTo;
var hasMany = Relations.HasMany;
var string = Fields.StringField;
var email = Fields.EmailField;

var User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: ['createdAt', 'updatedAt'],
  virtuals: {
    isAdmin: function() {
      return this.$role.name === 'admin';
    }
  }
}, {

  schema: [
    belongsTo('Role', {name: 'role'}),
    email('email', {required: true}),
    string('firstName', {required: true}),
    string('lastName', {required: true}),
    string('phone'),
    string('status', {
      validations: [val => _.includes(['active', 'inactive', 'blocked'], val)]
    }),
    string('auth0Id')
  ],

  getUserById: Promise.method(function(id) {
    return new this({id: id})
      .fetch();
  }),

  getUserByEmail: Promise.method(function(email) {
    return new this({email: email})
      .fetch();
  })
});

var userModel = bookshelf.model('User', User);

export default userModel;
