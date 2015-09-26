module.exports = function(socket){
  socket.on('connect', function(data){
    var i = 0;
    setInterval(function(){
      i += 1;
      console.log("hello client " + i );
      socket.emit("say", { msg: "hello client " + i });
    }, 2000);
  });
}