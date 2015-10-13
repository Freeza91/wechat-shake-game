var socket;

var init = function(soc){
  socket = soc;
}

var push = function(data){
  socket.emit("push_users", data)
}

exports.init = init;
exports.push = push;