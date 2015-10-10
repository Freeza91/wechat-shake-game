var crypto = require('crypto');

module.exports = function(str){
  var sha1 = crypto.createHash('sha1');
  sha1.update(str);

  return sha1.digest('hex');
}
