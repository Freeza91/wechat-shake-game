$(function(){
  var socket = io.connect();
  var SHAKE_THRESHOLD = 800;
  var last_update = 0;
  var x = y = z = last_x = last_y = last_z = 0;

  socket.on("shake", function(data){
    if(data.code == 1) {
      var score = data.score;
      $('#info').html(score);
    }
  });

  socket.on('rank', function(data){
    if(data.code == 1){
      var rank = data.rank;
      $("#rank").html(rank);
    }
  });

  function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();

    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
          alert('shake your hands');
          socket.emit('shake', { openid: openid } )
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
  }

  $.ajax({
    url: 'http://5bd25119.ngrok.io/wechats/api_index',
    type: 'GET',
    dataType: 'json',
    data: ''
  })
  .done(function(data) {
    var config = data;
    wx.config({
      debug: true,
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: config.jsApiList
    });

    openid = $('#openid').html();

    wx.ready(function(){
      $("#wechats").html("hello");

      setInterval(function(){
        socket.emit('rank', { openid: openid})
      }, 3000);

      if (window.DeviceMotionEvent) {
        alert('可以使用');
        window.addEventListener('devicemotion', deviceMotionHandler, false);
      } else {
        alert('本设备不支持devicemotion事件');
    }
    });

    wx.error( function(res){
    });

  })
  .fail(function(error) {
    console.log("error");
  })

});