var admin = require('./admin');

module.exports = function(io){

  io.sockets.on('connect', function (socket){

    // setInterval(function(){
    //   // https://redis.readthedocs.org/en/2.4/sorted_set.html
    //   // http://stackoverflow.com/questions/24157632/node-redis-get-zrange-withscores
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
      redis.client.zscoreAsync('users', openid)
        .then( function(data){
          if(data != null ){
            score = data + 1;
            return redis.client.zincrbyAsync('users', 1, openid);
          } else {
            socket.emit('shake', { code: -1, msg: '不存在' });
          }
        })
        .then( function(data){
          socket.emit("shake", { code: 1, score: score });
        })
    });

    socket.on('rank', function(data){

      var openid = data.openid;
      redis.client.zrevrankAsync('users', openid)
        .then( function(data){

          if(data != null){
            var rank = data;
            socket.emit('rank', { code: 1, rank: rank });
          } else {
            socket.emit('rank', { code: -1, msg: '不存在' })
          }
        })
    });

    admin.show(socket);

  });

}