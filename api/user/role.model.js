"use strict";
import bookshelf from '../base.model';

var Fields = require('bookshelf-schema/lib/fields');
var string = Fields.StringField;
var Role = bookshelf.Model.extend({
  tableName: 'roles',
}, {
  schema: [
    string('name')
  ]
});

export default bookshelf.model('Role', Role);
