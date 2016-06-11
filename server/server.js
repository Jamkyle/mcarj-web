var server = require('http').createServer()
var io = require('socket.io')(server);
var sendEmail = require('./Components/sendEmail.js')
// var planning = require('./Components/planning.js')
var generatePdf = require('./Components/generatePdf.js')
var url = require('url')

var port = 4200

server.listen(port, function(){
  console.log('server is running... on localhost:'+port);
});

io.sockets.on('connection', function (socket) {
  socket.emit('message', 'Vous êtes bien connecté !');
  socket.on('sendMail', function (data) {
    generatePdf.generatePdf(data)
  });
}
);
