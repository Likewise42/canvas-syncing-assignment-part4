const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read index into memory
const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass int he http server to socketio and grab the websocker server as io
const io = socketio(app);

const listeners = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    socket.join('room1');
  });

  socket.on('draw', (data) => {
    socket.broadcast.to('room1').emit('recieveDraw', data);
  });
};

io.sockets.on('connection', (socket) => {
  console.log('someone joined');

  listeners(socket);
});

console.log('Websocket server started');
