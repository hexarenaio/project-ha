const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectedUsers = new Set();

app.use(express.static('public'));

io.on('connection', (socket) => {
//START SOCKET CONNECTION
    
    //USUARIOS CONECTADOS
    console.log(`Total de usuarios: ${connectedUsers.size}`);
    console.log('Nuevo usuario conectado');
    connectedUsers.add(socket.id);
    io.emit('userCount', connectedUsers.size);


    
    //USUARIOS CONECTADOS
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

