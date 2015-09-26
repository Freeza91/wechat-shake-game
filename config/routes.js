// controllers
var pages = require('../controllers/pages_controller');
var wechats = require('../controllers/wechat_shake_controller');

// middlewares
var http_auth = require('../middlewares/http_auth');

module.exports = function(app){
  // index
  app.get('/', http_auth, pages.home);

  // wechats
  app.get('/wechats', wechats.index);

}