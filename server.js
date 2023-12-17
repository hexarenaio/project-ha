const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectedUsers = new Set(); // Usamos un conjunto para mantener un registro único de usuarios conectados


app.use(express.static('public'));

io.on('connection', (socket) => {

    console.log(`Total de usuarios: ${connectedUsers.size}`);

  console.log('Nuevo usuario conectado');

  connectedUsers.add(socket.id);

  // Emitir la cantidad de usuarios conectados a todos los clientes
  io.emit('userCount', connectedUsers.size);


  // Resto de la lógica

 // io.emit('userCount', Object.keys(io.sockets.sockets).length);

  socket.on('circle', (data) => {
    io.emit('circle', data);
  });

 socket.on('disconnect', () => {
    console.log('Usuario desconectado');

   connectedUsers.delete(socket.id);

    // Emitir la cantidad de usuarios conectados a todos los clientes
    io.emit('userCount', connectedUsers.size);

    // Resto de la lógica

   // io.emit('userCount', Object.keys(io.sockets.sockets).length);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

