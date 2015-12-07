/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'User',
  attributes: {
    email: {
      type: 'STRING',
      unique: true
    },
    password: 'STRING',
    tokens: 'ARRAY',

    // Instance methods
    toJSON: function() {
      var model = this;
      delete model.password;
      delete model.tokens;
      return model;
    }
  }
};

