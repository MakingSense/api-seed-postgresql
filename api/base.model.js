"use strict";
import config from '../config/environment';
import schema from 'bookshelf-schema';
import _ from 'lodash';

// db config
var knex = require('knex')({
  client: 'pg',
  connection: config.database,
  debug: process.env.DATABASE_DEBUG === 'true'
});

var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
bookshelf.plugin('virtuals');
bookshelf.plugin(schema({}));


bookshelf.Model = bookshelf.Model.extend({
  // convert camelCase to snake_case
  format: function format(attrs) {
    return _.reduce(attrs, function (memo, val, key) {
      memo[_.snakeCase(key)] = val;
      return memo;
    }, {});
  },

  // convert snake_case to camelCase
  parse: function parse(attrs) {
    return _.reduce(attrs, function (memo, val, key) {
      memo[_.camelCase(key)] = val;
      return memo;
    }, {});
  }
});

export default bookshelf;
export {knex};
