module.exports = function(io){

  io.sockets.on('connect', function (socket){

    var i = 0;

    setInterval(function(){
      i += 1;
      console.log("hello client " + i );
      socket.broadcast.emit("say", { msg: "hello client " + i });
    }, 2000);

    // socket.on("get_info", function(data){
    //   console.log(data);

    //   setInterval(function(){
    //   socket.emit('say', { msg: "hello get info "} );
    //   }, 4000);

    // });

  });

}