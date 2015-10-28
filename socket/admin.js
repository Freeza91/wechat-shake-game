var redis = require('../lib/redis'),
    client = redis.client;

var counter = 0;
var socket;

function pushInterval(){

  counter += 1;

  setTimeout(function(){
    client.getAsync('flag')
      .then(function(data){

        if(data){
          return client.zrevrangeAsync('users', 0, 4, 'withscores');
        } else {
          if(counter <= 50){
            pushInterval();
          } else {
            socket.emit('end', { code: 2, msg: '游戏结束' })
            throw new Error("end game")
          }
        }

      })
      .then(function(data){

        socket.emit('all_rank', { code: 1, users: data });

        if(counter <= 50){
          pushInterval();
        } else {
          socket.emit('end', { code: 2, msg: '游戏结束' })
          throw new Error("end game")
        }

      })
      .catch( function(error){
        console.log(error.message);
      })

  }, 1000)
}
var show = function(sock){
  socket = sock;

  socket.on('start', function(data){

    if(data.flag === 'start'){
      setTimeout(function(){
        pushInterval();
        redis.store_with_time('flag', true, 31);
      }, 4);
    }

  })

}

exports.show = show;