const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const players = [];

io.on('connection', (socket) => {
  console.log(`Nuevo usuario conectado`);

  socket.on('playerMove', (data) => {
    const existingPlayer = players.find((player) => player.playerName === data.playerName);

    if (existingPlayer) {
      existingPlayer.position = data.position;
    } else {
      players.push({ playerName: data.playerName, position: data.position });
    }

    // Emitir la información actualizada a todos los clientes
    io.emit('updatePlayers', players);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado`);
    // Eliminar al usuario desconectado de la lista de jugadores
    const index = players.findIndex((player) => player.playerName === socket.id);
    if (index !== -1) {
      players.splice(index, 1);
      // Emitir la información actualizada a todos los clientes
      io.emit('updatePlayers', players);
    }
  });
});

// Configuraciones adicionales del servidor

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
