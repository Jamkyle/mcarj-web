import io from 'socket.io-client'

let port = 4200
let host = 'http://120.0.0.1:4200'
let servername = host+':'+port

// export const socket = io.connect('http://192.168.1.21:4200');
// export const socket = io.connect('http://192.168.0.14:4200');
// export const socket = io.connect('http://192.168.0.22:4200');
export const socket = io.connect(host);

socket.on('connect', function (message) {

});
