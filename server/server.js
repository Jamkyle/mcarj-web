var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sendEmail = require('./Components/sendEmail.js')

app.use(express.static(__dirname + '/Components'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(4200);

io.sockets.on('connection', function (socket) {
        socket.emit('message', 'Vous êtes bien connecté !');
        socket.on('sendMail', function (data) {
          sendEmail.sendMail(data)
        });
});
