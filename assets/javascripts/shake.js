$(function(){
  var socket = io.connect();
  var SHAKE_THRESHOLD = 800;
  var last_update = 0;
  var x = y = z = last_x = last_y = last_z = 0;
  var MAX_SHAKE_NUM = Math.floor((Math.random() * 5) + 5);
  var counter = 0;
  var openid;

  function showInfo(){
    $('.spinner').hide();
    $('.user-info').show();
  }

  function errorInfo(){

  }

  socket.on("shake", function(data){
    if(data.code == 1) {
      $('#info').html(data.num);
    } else if(data.code == -1) {
      alert('不存在这个用户');
    } else if(data.code == 0){
      alert('比赛还没开始');
    }
  });

  socket.on('show-me', function(data){
    if(data.code === 1){
      showInfo();
    } else {
      errorInfo();
    }
  })

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
          counter += 1;
          alert('counter:' + counter + 'MAX_SHAKE_NUM:' + MAX_SHAKE_NUM);
          if(counter >= MAX_SHAKE_NUM){
            socket.emit('shake', { openid: openid, num: counter });
            counter = 0;
            MAX_SHAKE_NUM = Math.floor((Math.random() * 5) + 5);
          }
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
  }

  $.ajax({
    url: '/wechats/api_index',
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

    openid = $('.openid').html();

    wx.ready(function(){

      if (window.DeviceMotionEvent) {
        alert('可以使用');
        window.addEventListener('devicemotion', deviceMotionHandler, false);
      } else {
        alert('本设备不支持devicemotion事件');
      }

      socket.emit('start_push_me', { openid: openid } );

    });

    wx.error( function(res){
    });

  })
  .fail(function(error) {
    console.log("error");
  })

});