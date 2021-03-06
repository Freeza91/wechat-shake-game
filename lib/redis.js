var Promise = require("bluebird"),
    redis = require("redis"),
    client = redis.createClient();

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var store_with_time = function(key, value, time){
  client.set(key, value);
  client.expire(key, time);
}

var store = function(key, value){
  client.set(key, value);
}

var get_value = function(key){
  return client.getAsync(key)
    .then(function(value){
      return value;
    });
}

var init_user_data = function(data){
  var openid = data.openid;
  var userDB = data;

  _promise =
    client.zscoreAsync('users', openid)
      .then(function(data){
        if(data || data == 0){
          return data;
        } else {
          client.zadd('users', 0, openid);
          client.expire('users', 86400);
          // JSON.parse can read
          store_with_time(openid, JSON.stringify(userDB), 86400);

          return 0;
        }
      });

  return _promise;
}

var get_users_data = function(key){

  _promise =
    client.zrangeAsync(key, 0, -1)
      .then(function(data){
        return data;
      });

  return _promise;
}

exports.client = client;
exports.store_with_time = store_with_time;
exports.store = store;
exports.get_value = get_value;
exports.init_user_data = init_user_data;
exports.get_users_data = get_users_data;