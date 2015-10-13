$(function(){

  var socket = io.connect();

  socket.on('all_rank', function(data){
    if(data.code == 1){
      users = data.users;
      // console.log(data.users);
      $('#info').html(users[1]);
    } else {
      console.log('发生错误');
      console.log(data.msg);
    }
  });

  socket.on('push_users', function(data){
    $('#users').html(JSON.stringify(data));
  })

  $('#start').on('click', function(data){
    socket.emit('start', { flag: 'start' });
    // begin time counter reverse for 5s
  });

  socket.on('end', function(data){
    if(data.code === 1){
      // begin black screen and show scores
    }
  })

});