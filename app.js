var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var settings = require('./config/application');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
var routes = require('./config/routes');
routes(app);

// log
var fs = require('fs')
var accessLog = fs.createWriteStream('./log/access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('./log/error.log', {flags: 'a'});

// socket.io
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var socket = require('./socket/index');
socket(io.sockets);

// start server
app.set('port', process.env.PORT || settings.port);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
