var auth = require('basic-auth');
var settings = require('../config/application');

module.exports = function (req, res, next){
  var credentials = auth(req);

  if (!credentials ||
      credentials.name !== settings.http_username || credentials.pass !== settings.http_password) {

    res.statusCode = 401
    res.setHeader('WWW-Authenticate', '需要认证方可看到');
    res.end('Access denied');
  } else {
    next();
  }
}