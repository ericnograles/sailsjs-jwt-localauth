var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  login: login,
  create: create
};

function create(req, res) {
  // TODO: This would live in its own abstraction layer, like UserService
  if (req.method === 'POST') {
    var payload = req.body;
    payload.password = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(10));
    User.create(payload)
        .then(function(createdUser) {
          var dto = createdUser.toJSON();
          var accessToken = jwt.sign(dto, 'TODO:ActuallyUseASecretHere', {expiresIn: '24h'});
          createdUser.tokens = [accessToken];
          createdUser
            .save(function(err) {
              if (err) {
                return res.json(500, err);
              } else {
                return res.json(200, {access_token: accessToken, access_token_type: 'Bearer'});
              }
            });
        })
        .catch(function(err) {
          return res.json(500, err);
        });
  } else {
    return res.json(500, {error: 'Invalid method'});
  }

}

function login(req, res) {
  // TODO: This would live in its own abstraction layer, like UserService
  if (req.method === 'POST') {
    User.findOne({email: req.body.email})
      .then(function(existingUser) {
        // Compare the password
        bcrypt.compare(req.body.password, existingUser.password, function(err, result) {
          if (!result) {
            return res.json(401, {error: 'Invalid password'});
          } else {
            var dto = existingUser.toJSON();
            var accessToken = jwt.sign(dto, 'TODO:ActuallyUseASecretHere', {expiresIn: '24h'});
            existingUser.tokens.push(accessToken);
            existingUser
              .save(function(err) {
                if (err) {
                  return res.json(500, err);
                } else {
                  return res.json(200, {access_token: accessToken, access_token_type: 'Bearer'});
                }
              });
            return res.json(200, {access_token: accessToken, access_token_type: 'Bearer'});
          }
        });
      })
      .catch(function(err) {
        return res.json(401, err);
      });
  } else {
    return res.json(500, {error: 'Invalid method'});
  }
}

