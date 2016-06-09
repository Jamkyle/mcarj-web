import io from 'socket.io-client'

export const socket = io.connect('http://localhost:4200');

socket.on('connect', function (socket) {
  console.log('Connected!');
});

socket.on('message', function(message) {
  console.log('Le serveur a un message pour vous : ' + message);
})
