$(function(){

  $.ajax({
    url: 'http://691e9693.ngrok.io/wechats/api_index',
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

    });
  })
  .fail(function(error) {
    console.log("error");
  })

});