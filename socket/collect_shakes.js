var redis = require('../lib/redis'),
    client = redis.client;

var collect = function(socket){

  socket.on('shake', function(data){
    var openid = data.openid;
    var num = data.num;

    client.getAsync('flag').then(function(data){
      if(data){
        return client.zscoreAsync('users', openid)
      } else {
        socket.emit('shake', { code: 0, msg: '比赛还没开始'} );
      }
    }).then(function(data){
        if(data){
          num = data + num;
          return client.zincrbyAsync('users', num, openid);
        } else {
          socket.emit('shake', { code: -1, msg: '不存在这个用户' });
        }
      }).then(function(data){
        socket.emit("shake", { code: 1, num: num });
      })
  });

  socket.on('start_push_me', function(data){
    var openid = data.openid;

    client.getAsync(openid).then(function(data){
      if(data){
        socket.emit('show-me', { code: 1, msg: 'show users' });
      } else {
        socket.emit('show-me', { code: -1, msg: '不存在' });
      }
    });
  })
}

exports.collect = collect;