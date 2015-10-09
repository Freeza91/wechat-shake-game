var redis = require('../lib/redis');

module.exports = function(io){

  io.sockets.on('connect', function (socket){
    var result = [];

    setInterval(function(){

      // http://stackoverflow.com/questions/24157632/node-redis-get-zrange-withscores
      redis.zrevrange('hello-set', 0, -1, 'withscores', function (err, reply){
        result = reply;
        for(var i=0; i<reply.length; i++){
          if(i % 2 == 1){
            console.log(result[i]);
          }
        }
      })

      randNum = Math.floor((Math.random() * 10));
      socket.broadcast.emit("say", { msg: "hello client " + result[randNum] });

    }, 1000);
  });

}