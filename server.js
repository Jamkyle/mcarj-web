var express = require('express')
var http = require('http')
var sendEmail = require('./Components/sendEmail.js')
var planning= require('./Components/planning.js')
// var planning = require('./Components/planning.js')
var generatePdf = require('./Components/generatePdf.js')
var url = require('url')
var app = new express()
var server = new http.Server(app)
var io = require('socket.io')(server)
var port = require('./config.js').port

app.use('/cancel', function(req, res){
  var Url = url.parse(req.url).query
  console.log(Url);
})

server.listen(port, function(){
  console.log('server is running... on *:' + port);
});

io.sockets.on('connection', function (socket) {
  socket.emit('connect', 'vous êtes bien connecté')
  socket.on('sendMail', function (data) {
    generatePdf(data)
    planning.plan(data)

  });
  exports.socket = socket;
});
