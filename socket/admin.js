var redis = require('../lib/redis'),
    client = redis.client;

var show = function(socket){

  setInterval(function(){
    client.zrevrangeAsync('users', 0, 4, 'withscores').then(function(data){
      socket.emit('all_rank', { code: 1, users: data });
    })
  }, 1000);

}

exports.show = show;