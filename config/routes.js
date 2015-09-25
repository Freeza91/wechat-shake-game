var pages = require('../controllers/pages_controller');

module.exports = function(app){

  // index
  app.get('/', pages.home);

}