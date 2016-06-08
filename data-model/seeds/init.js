"use strict";

exports.seed = function (knex, Promise) {

  return cleanDb(knex)
    .then(function () {
      return seedRoles(knex);
    });
};

function cleanDb(knex) {
  return knex('users').del()
    .then(function () {
      return knex('roles').del();
    });
}

function seedRoles(knex) {
  // delete all roles
  return resetSequence(knex, 'roles')
    .then(function () {
      // insert user role
      return knex('roles').insert(require('../fixtures/roles'));
    });
}

function resetSequence(knex, tableName) {
  return knex.raw('SELECT setval(\'' + tableName + '_id_seq\', 1, false);');
}
