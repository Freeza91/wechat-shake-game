// controllers
var pages = require('../controllers/pages_controller');
var wechats = require('../controllers/wechat_shake_controller');
var admin = require('../controllers/admin_controller');

// middlewares
var http_auth = require('../middlewares/http_auth');

module.exports = function(app){
  // index
  // app.get('/', http_auth, pages.home);
   app.get('/', pages.home);

  // wechats
  app.get('/wechats', wechats.index);
  app.get('/wechats/api_index', wechats.api_index);

  // admin
  app.get('/admin', http_auth, admin.index);

}