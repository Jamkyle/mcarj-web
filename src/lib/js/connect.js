import io from 'socket.io-client'

let port = 4200
// let host = 'http://localhost:4200'
let host = 'http://5.79.70.182'
let servername = host+':'+port

// export const socket = io.connect('http://192.168.1.21:4200');
// export const socket = io.connect('http://192.168.0.14:4200');
// export const socket = io.connect('http://192.168.0.22:4200');
export const socket = io.connect(host);

socket.on('connect', function (message) {
  console.log(message);
});
