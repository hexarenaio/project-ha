const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  // Resto de la lógica

  io.emit('userCount', Object.keys(io.sockets.sockets).length);

  socket.on('circle', (data) => {
    io.emit('circle', data);
  });

 socket.on('disconnect', () => {
    console.log('Usuario desconectado');

    // Resto de la lógica

    io.emit('userCount', Object.keys(io.sockets.sockets).length);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
