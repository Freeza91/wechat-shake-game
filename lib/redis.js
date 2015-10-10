var Promise = require("bluebird");
    redis = require("redis");
    client = redis.createClient();

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

module.exports = client;