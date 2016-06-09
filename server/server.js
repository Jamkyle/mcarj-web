var server = require('http').createServer();
var io = require('socket.io')(server);
var sendEmail = require('./Components/sendEmail.js')

server.listen(4200, function(){
  console.log('server is running...');
});

io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Vous êtes bien connecté !');
        socket.on('sendMail', function (data) {
          sendEmail.sendMail(data)
        });
});
