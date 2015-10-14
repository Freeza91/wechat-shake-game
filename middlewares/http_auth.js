var auth = require('basic-auth');
var settings = require('../config/application');

module.exports = function (req, res, next){
  var auth;

  if (req.headers.authorization) {
    auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
  }

  if (!auth || auth[0] !== settings.http_username ||
      auth[1] !== settings.http_password) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
      res.end('Unauthorized');
  } else {
      next();
  }
}