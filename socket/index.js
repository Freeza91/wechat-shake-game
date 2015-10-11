var redis = require('../lib/redis');

module.exports = function(io){

  io.sockets.on('connect', function (socket){

    // setInterval(function(){
    //   // https://redis.readthedocs.org/en/2.4/sorted_set.html
    //   // http://stackoverflow.com/questions/24157632/node-redis-get-zrange-withscores
    //   redis.zrevrange('hello-set', 0, -1, 'withscores', function (err, reply){
    //     result = reply;
    //     for(var i=0; i<reply.length; i++){
    //       if(i % 2 == 1){
    //         console.log(result[i]);
    //       }
    //     }
    //   })

    //   randNum = Math.floor((Math.random() * 10));
    //   socket.broadcast.emit("say", { msg: "hello client " + result[randNum] });

    // }, 5000);

    socket.on('shake', function(data){

      var openid = data.openid;
      redis.zscoreAsync('users', openid)
        .then( function(data){
          score = data + 1;
          return redis.zincrbyAsync('users', 1, openid);
        })
        .then( function(data){
          socket.emit("shake", { score: score });
        })
    });

    socket.on('rank', function(data){

      var openid = data.openid;
      redis.zrevrankAsync('users', openid)
        .then( function(data){
          var rank = data;
          socket.emit('rank', { rank: rank });
        })
    });

  });

}