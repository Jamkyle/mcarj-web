import io from 'socket.io-client'

let port = 4200
let host = 'http://localhost'

// export const socket = io.connect('http://192.168.1.21:4200');
// export const socket = io.connect('http://192.168.0.14:4200');
// export const socket = io.connect('http://192.168.0.22:4200');
export const socket = io.connect(host+':'+port);

socket.on('connect', function (message) {

});
