var admin = require('./admin'),
    collect_shakes = require('./collect_shakes');

module.exports = function(io){

  io.sockets.on('connect', function (socket){

    collect_shakes.collect(socket);
    admin.show(socket);

  });

}