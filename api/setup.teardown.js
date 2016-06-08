import base from './base.model';

var knex = base.knex;


var initializeDb = function() {
  return knex
    .migrate.latest({directory: './data-model/migrations'})
    .then(function() {
      return knex.seed.run({directory: './data-model/seeds'});
    });
};

var rollback = function() {
  return knex.migrate.rollback({directory: './data-model/migrations'});
};

export {initializeDb, rollback, knex};
