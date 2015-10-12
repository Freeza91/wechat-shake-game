var Promise = require('bluebird'),
    sha1 = require('./sha1');

var generate_signature = function(config) {

  var string1 = 'jsapi_ticket=' + config.jsapi_ticket +
               '&noncestr=' + config.nonceStr +
               '&timestamp=' + config.timestamp +
               '&url=' + config.url;

  return sha1(string1);
}

var get_request_url = function(req){
  return 'http://' + req.headers.host + req.originalUrl;
}

var url_encode = function(url){
  return encodeURIComponent(url);
}

var new_promise = function(data){
  return new Promise(function(resolve){
    resolve(data);
  })
}

exports.url_encode  = url_encode;
exports.generate_signature = generate_signature;
exports.get_request_url = get_request_url;
exports.new_promise = new_promise;
