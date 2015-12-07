var jwt = require('jsonwebtoken');
var _ = require('lodash');


module.exports = function(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization.replace('Bearer ','');
    jwt.verify(token, 'TODO:ActuallyUseASecretHere', function(err, decoded) {
      if (err || !decoded) {
        return res.forbidden({error: 'You are not permitted to perform this action'});
      } else {
        User.findOne({id: decoded.id})
            .exec(function(err, user) {
              if (err || !user) {
                return res.forbidden({error: 'You are not permitted to perform this action'});
              } else {
                // Check for doctoring
                var existingToken = _.find(user.tokens, function(userToken) {
                  return userToken === token;
                });
                if (existingToken) {
                  req.currentUser = user;
                  return next();
                } else {
                  return res.forbidden({error: 'You are not permitted to perform this action'});
                }

              }
            });
      }
    });
  } else {
    return res.forbidden({error: 'You are not permitted to perform this action'});
  }
};