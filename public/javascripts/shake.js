$(function(){
  var SHAKE_THRESHOLD = 800;
  var last_update = 0;
  var x = y = z = last_x = last_y = last_z = 0;
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
          alert('');
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
  }

  $.ajax({
    url: 'http://b8c6973e.ngrok.io/wechats/api_index',
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

    wx.ready(function(){
      $("#wechats").html("hello");

      wx.checkJsApi({
        jsApiList: ['chooseImage'],
          success: function(res) {
        }
      });

      wx.error( function(res){
      });

      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
      } else {
        alert('本设备不支持devicemotion事件');
      }

    });
  })
  .fail(function(error) {
    console.log("error");
  })

});