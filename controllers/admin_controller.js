var redis = require('../lib/redis'),
    eventproxy = require('eventproxy'),
    ep = new eventproxy();

var index = function(req, res, next){
  redis.get_users_data("users")
    .then(function(data){
      var keys = data;
      var users = []

      for(item in keys){
        redis.get_value(keys[item])
          .then(function(data){
            users.push(JSON.parse(data));
            ep.emit("users");
          })
      }

      ep.after('users', keys.length, function(){
        res.render('admins', {
          users: users
        });
      });

    });
}

var test = function (req, res, next){
  // userInfo = {
  //   "openid": Math.random().toString(36).substring(7),
  //   "nickname": "nickname",
  //   "sex":"1",
  //   "province":"PROVINCE",
  //   "city":"CITY",
  //   "country":"COUNTRY",
  //   "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
  //   "privilege":[
  //     "PRIVILEGE1",
  //     "PRIVILEGE2"
  //   ],
  //   "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
  //   }
  var openid = '23232323232';
  var client = redis.client;

  client.getAsync('flag')
    .then(function(data){
      if(data){
        return client.zscoreAsync('users', openid)
      } else {
        // socket.emit('shake', { code: 0, msg: '比赛还没开始'} )
        throw new Error(codes.not_exist)
      }
    })
    .then(function(data){
      console.log(798);
      if(data){

        num = data + num;
        return client.zincrbyAsync('users', num, openid);
      } else {

        // socket.emit('shake', { code: -1, msg: '不存在这个用户' })
        throw new Error(code.user_not_exist)
      }
    })
    .then(function(data){

      // socket.emit("shake", { code: 1, num: num });
    })
    .catch( function(error){
      console.log(error)
    })

}

exports.test = test;
exports.index = index;