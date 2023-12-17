const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectedUsers = new Set();

//COLORES PARA JUGADOR
const availableColors = ['blue', 'red', 'green', 'purple', 'orange']; // Puedes agregar más colores según sea necesario
const assignedColors = new Map(); // Mapa para almacenar el color asignado a cada jugador



app.use(express.static('public'));

io.on('connection', (socket) => {
//START SOCKET CONNECTION
    
    //USUARIOS CONECTADOS
    console.log(`Total de usuarios: ${connectedUsers.size}`);
    console.log('Nuevo usuario conectado');
    connectedUsers.add(socket.id);
    io.emit('userCount', connectedUsers.size);


 // Asignar un color único al jugador
    const availableColor = availableColors.find(color => !assignedColors.has(color));
    if (availableColor) {
        assignedColors.set(socket.id, availableColor);
    }

    // Enviar el color asignado al jugador
    socket.emit('assignColor', assignedColors.get(socket.id));


socket.on('updatePosition', (data) => {
        const updatedPlayer = {
            id: socket.id,
            x: data.x,
            y: data.y,
            color: assignedColors.get(socket.id), // Puedes personalizar el color si es necesario
        };

        io.emit('updatePlayers', updatedPlayer);
    });
    
    //USUARIOS DESCONECTADOS
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        connectedUsers.delete(socket.id);
        io.emit('userCount', connectedUsers.size);
    });

//END SOCKET CONNECTION    
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

