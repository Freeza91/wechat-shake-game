var Promise = require("bluebird");
    request = Promise.promisifyAll(require("request"));
    settings = require('../config/application');
    redis = require('../lib/redis');
    sha1 = require('../lib/sha1');
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
  url: 'http://691e9693.ngrok.io/wechats'
}

function store_access_token(access_token){
  redis.set('access_token', access_token);
  redis.expire('access_token', 7100);
}

function store_ticket(ticket){
  redis.set('ticket', ticket);
  redis.expire('ticket', 3600);
}

function access_token_request(){
  promise =
    request.getAsync(access_token_url)
      .then( function(response){
        var body = response[1];
            access_token = JSON.parse(body).access_token;

        store_access_token(access_token);
        return access_token;
      });

  return promise;
}

function js_ticket_request(url){
  promise =
    request.getAsync(url)
      .then( function(response){
        var body = response[1];
            ticket = JSON.parse(body).ticket;

        store_ticket(ticket);
        return ticket;
      });

  return promise;
}


function generate_signature(config) {

  var string1 = 'jsapi_ticket=' + config.jsapi_ticket +
               '&noncestr=' + config.nonceStr +
               '&timestamp=' + config.timestamp +
               '&url=' + config.url;

  return sha1(string1);
}


// ZINCRBY
// https://redis.readthedocs.org/en/2.4/sorted_set.html
var base_url = encodeURIComponent('http://0706963c.ngrok.io/wechats');
var index = function(req, res, next){

  var code = req.query.code;

  if(code == null || code == undefined ){
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize' +
              '?appid=' + settings.appID +
              '&redirect_uri=' + base_url +
              '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

    res.redirect(url);
  } else {
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token' +
              '?appid=' + settings.appID +
              '&secret=' + settings.appsecret +
              '&code=' + code +
              '&grant_type=authorization_code';

    request.getAsync(url)
      .then( function(response){
        var body = JSON.parse(response[1]);

        if( body.errcode == 40029 ){
          render.json({
            errmsg: body.errmsg
          })
        }else {
          var access_token = body.access_token;
          var openid = body.openid;
          var url = 'https://api.weixin.qq.com/sns/userinfo' +
                    '?access_token=' + access_token +
                    '&openid=' + openid +
                    '&lang=zh_CN';

          request.getAsync(url)
            .then( function(response){
              var body = JSON.parse(response[1]);
              if( body.errcode == 40003 ){
                render.json({
                  errmsg: body.errmsg
                })
              }else {
                res.render('wechats/index', body);
              }
            });
        }
      });
  }
}

var api_index = function (req, res, next){

  redis.getAsync("access_token")
    .then( function(value){

      if(value === null){
          return access_token_request();
      }else {
        return value;
      }
    })
    .then( function(data){

      access_token = data;

      return redis.getAsync('ticket')
        .then( function(value){
          if(value === null){
            var js_ticket_url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket' +
                          '?type=jsapi&' +
                          'access_token=' + access_token;
            return js_ticket_request(js_ticket_url);
          } else {
            return value;
          }
        });
    })
    .then( function(data){

      ticket = data;
      config.jsapi_ticket = ticket;
      config.signature = generate_signature(config);
      res.json(config);
    })
    .catch(function(e){

      console.log(e)
      res.json({
        error: "发生未知错误"
      })
    })
}

exports.index = index;
exports.api_index = api_index;