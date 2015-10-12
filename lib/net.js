var Promise = require("bluebird"),
    request = Promise.promisifyAll(require("request"));

var get = function(url){
  _promise =
    request.getAsync(url)
      .then( function(response){
        return JSON.parse(response[1]);
      });

  return _promise;
}

exports.get = get;