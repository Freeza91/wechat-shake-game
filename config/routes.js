var pages = require('../controllers/pages_controller');
var http_auth = require('../middlewares/http_auth');

module.exports = function(app){
  // index
  app.get('/', http_auth, pages.home);

}