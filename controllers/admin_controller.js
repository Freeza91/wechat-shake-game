var redis = require('../lib/redis');

var index = function(req, res, next){
  var users;

  redis.get_user_data.then(function(data){
    users = data;
  });

  res.render('admins', users);
}

exports.index = index;