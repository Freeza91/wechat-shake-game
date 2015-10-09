var redis = require('../lib/redis');

exports.home = function (req, res, next) {

  redis.on('ready', function ZaddValue(){
    for(var i=0; i<10; i++){
      var score = i;
      var key = "key" + i;
      redis.zadd('hello-set', i, key);
    }
    console.log("hello");
  });

  res.render('pages/home');
}