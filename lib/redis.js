var Promise = require("bluebird");
    redis = require("redis");
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

var init_user_data = function (openid){
  _promise =
    redis.zscoreAsync('users', openid)
      .then(function(data){
        if(data == null){
          redis.zadd('users', 0, openid);
          redis.expire('users', 1000);
          return 0;
        } else {
          return data;
        }
      })

  return _promise;
}

exports.client = client;
exports.store_with_time = store_with_time;
exports.store = store;
exports.get_value = get_value;
exports.init_user_data = init_user_data;