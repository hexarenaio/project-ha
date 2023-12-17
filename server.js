const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectedUsers = new Set(); // Usamos un conjunto para mantener un registro único de usuarios conectados




//Representación del jugador (círculo azul)
const bluePoint = {
    id: 'bluePoint',
    name: '', // Agrega el nombre del jugador
    x: 170, // Posición X inicial del jugador
    y: 170, // Posición Y inicial del jugador
    color: 'blue', // Color azul por defecto
};

app.use(express.static('public'));

io.on('connection', (socket) => {






socket.join('hexagonGroup');

    // Asignar el nombre al jugador actual
    bluePoint.name = ''; // Asigna el nombre del jugador si es necesario

    // Emitir información del nuevo jugador a todos los clientes en hexagonGroup
    io.to('hexagonGroup').emit('newPlayer', bluePoint);

    // Resto de la lógica

    // Escuchar actualizaciones de posición del jugador
    socket.on('updatePosition', function (newPosition) {
        // Actualizar las coordenadas del jugador
        bluePoint.x = newPosition.x;
        bluePoint.y = newPosition.y;

        // Emitir la actualización solo al grupo hexagonGroup
        io.to('hexagonGroup').emit('updatePlayers', bluePoint);


});


    console.log(`Total de usuarios: ${connectedUsers.size}`);

  console.log('Nuevo usuario conectado');

  connectedUsers.add(socket.id);

  // Emitir la cantidad de usuarios conectados a todos los clientes
  io.emit('userCount', connectedUsers.size);


  // Resto de la lógica

 // io.emit('userCount', Object.keys(io.sockets.sockets).length);

  




 socket.on('disconnect', () => {




// Emitir información actualizada solo al grupo hexagonGroup
        io.to('hexagonGroup').emit('updatePlayers', bluePoint);

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
