var redis = require('../lib/redis'),
    client = redis.client;

var collect = function(socket){

  // https://redis.readthedocs.org/en/2.4/sorted_set.html
  // socket.broadcast.emit("say", { msg: "hello client " + result[randNum] });

  socket.on('shake', function(data){

    var openid = data.openid;
    var num = data.num;
    var score;
    client.getAsync('flag').then(function(data){
      if(data){
        return client.zscoreAsync('users', openid)
      } else {
        socket.emit('shake', { code: 0, msg: '比赛还没开始'} );
      }
    }).then(function(data){
        if(data){
          score = data + num;
          return client.zincrbyAsync('users', num, openid);
        } else {
          socket.emit('shake', { code: -1, msg: '不存在这个用户' });
        }
      }).then(function(data){
        socket.emit("shake", { code: 1, score: score });
      })
  });

  socket.on('my_rank', function(data){

    var openid = data.openid;

    client.zrevrankAsync('users', openid).then(function(data){
        if(data || data == 0){
          var rank = data;
          socket.emit('my_rank', { code: 1, rank: rank });
        } else {
          socket.emit('my_rank', { code: -1, msg: '不存在' })
        }
      })
  });

}

exports.collect = collect;