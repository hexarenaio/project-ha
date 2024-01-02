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
let colorIndex = 0; // Índice para asignar colores a usuarios

const players = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    
//START SOCKET CONNECTION ///////    ///////    ///////  ///////    ///////    ///////    ///////    ///////    ///////    
    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    

 
    //USUARIOS CONECTADOS
    console.log(`Total de usuarios: ${connectedUsers.size}`);
    console.log('Nuevo usuario conectado');
    connectedUsers.add(socket.id);
    io.emit('userCount', connectedUsers.size);

    const colorsArray = Array.from(availableColors); // Convierte el conjunto a un array para obtener un índice
    const userColor = colorsArray[colorIndex % colorsArray.length];
    colorIndex++;

    assignedColors.set(socket.id, userColor);

    socket.on('assignColor', function (playerName) {
        const userColor = colorsArray[colorIndex % colorsArray.length];
        colorIndex++;
        assignedColors.set(socket.id, { color: userColor, name: playerName });
        console.log(`Jugador ${playerName} conectado. Color asignado: ${userColor}: ${assignedColors.get(socket.id)}`);
        
     //   io.emit('updatePlayers', players);

        socket.emit('assignColor', { color: userColor, name: playerName });
    });

    console.log(`Color asignado a ${socket.id}: ${assignedColors.get(socket.id)}`);

//    socket.emit('assignColor', assignedColors.get(socket.id));

    players[socket.id] = {
    //x: Math.random() * 500,
  //  y: Math.random() * 500,


x: 200,
    y: 200,
        color: assignedColors.get(socket.id),

    
    };

//    io.emit('updatePlayers', players); // Envía la información de los jugadores a todos los clientes

    socket.on('updatePosition', function (position) {
    // Actualiza la posición del jugador en el servidor
    players[socket.id].x = position.x;
    players[socket.id].y = position.y;
        //NUEVO PRUEBA
   // players[socket.id].color = position.assignedColors.get(socket.id);

    // Emite la actualización a todos los clientes
   

// io.emit('updatePlayers', players);



socket.emit('updatePlayers', { [socket.id]: players[socket.id] });

    });

    socket.on('animationData', function (data) {
                const playerName = assignedColors.get(socket.id).name;

        // Emitir datos a todos los clientes
        io.emit('animateBluePoint', { playerId: socket.id, data: data, playerName: playerName });

            console.log(`Annimation name: ${playerName}`);

        
    });

    socket.on('playerNameAssigned', (assignedName) => {
        console.log(`Nombre del jugador asignado: ${assignedName}`);
        // Ahora puedes emitir 'updatePlayers' ya que el nombre se ha asignado
       // io.emit('updatePlayers', players);
    });

    
    //USUARIOS DESCONECTADOS
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        assignedColors.delete(socket.id);
        connectedUsers.delete(socket.id);
        delete players[socket.id]; //
        io.emit('updatePlayers', players); //
        io.emit('userCount', connectedUsers.size);
    });


//END SOCKET CONNECTION////////////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////   
    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    
    
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
