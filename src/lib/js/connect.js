import io from 'socket.io-client'

export const socket = io.connect('http://192.168.0.14:4200');

socket.on('connect', function (socket) {
  
});
