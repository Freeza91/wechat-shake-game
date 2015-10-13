var admin = require('./admin'),
    push_users = require('../lib/push_users'),
    collect_shakes = require('./collect_shakes');

module.exports = function(io){

  io.sockets.on('connect', function (socket){

    collect_shakes.collect(socket);
    admin.show(socket);
    push_users.init(socket);

  });

}