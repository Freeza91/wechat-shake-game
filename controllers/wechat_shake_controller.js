var settings = require('../config/application'),
    net = require('../lib/net'),
    util = require('../lib/util'),
    sha1 = require('../lib/sha1'),
    redis = require('../lib/redis'),
    access_token_url = 'https://api.weixin.qq.com/cgi-bin/token?' +
        'grant_type=client_credential&' +
        'appid=' + settings.appID + '&' +
        'secret=' + settings.appsecret;

var config = {
  appId: settings.appID,
  jsApiList: ['menuItem:refresh', 'menuItem:originPage', 'menuItem:openWithQQBrowser',
              'menuItem:openWithSafari', 'menuItem:share:appMessage'],
  nonceStr: 'my-wechat-shake-game',
  timestamp: Math.floor((new Date('1991 10 04')) / 1000),
  url: 'http://localhost:4000/wechats'
}

var index = function(req, res, next){

  var code = req.query.code;
  var base_url = util.get_request_url(req);

  if(code == null || code == undefined ){
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize' +
              '?appid=' + settings.appID +
              '&redirect_uri=' + util.url_encode(base_url) +
              '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

    res.redirect(url);
  } else {
    config.url = util.get_request_url(req);
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token' +
              '?appid=' + settings.appID +
              '&secret=' + settings.appsecret +
              '&code=' + code +
              '&grant_type=authorization_code';

    net.get(url).then( function(data){
        if(data.errcode == 40029){
          res.json({
            errmsg: data.errmsg
          })
        } else {
          access_token_info = data.access_token;
          openid_info = data.openid;
          var url = 'https://api.weixin.qq.com/sns/userinfo' +
                    '?access_token=' + access_token_info +
                    '&openid=' + openid_info +
                    '&lang=zh_CN';

          return net.get(url);
        }
      }).then(function(data){
        if(data.errcode == 40003){
          res.json({
            errmsg: data.errmsg
          });
        } else {
          userInfo = data;
          res.render('wechats/index', userInfo);
        }
      })
    }
}

var api_index = function (req, res, next){

  redis.get_value('access_token').then(function(data){ // access_token
      if(data == null){
        return net.get(access_token_url).then(function(data){

          var access_token = data.access_token;
          redis.store_with_time('access_token', access_token, 7200);
          return access_token;
        });
      } else {
        return util.new_promise(data);
      }
    }).then( function(data){
      access_token = data;
      signature = sha1(access_token);
      return redis.get_value('ticket' + signature);
    }).then( function(data){  // ticket
      if(data == null){
        var js_ticket_url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket' +
                          '?type=jsapi&' +
                          'access_token=' + access_token;
        return net.get(js_ticket_url).then(function(data){
          return data.ticket;
        });
      } else {
        return util.new_promise(data);
      }
    }).then( function(data){
      ticket = data;
      config.jsapi_ticket = ticket;
      config.signature = util.generate_signature(config);

      res.json(config);
    }).catch(function(e){
      console.log(e)
      res.json({
        error: "发生未知错误"
      })
    })
}

exports.index = index;
exports.api_index = api_index;