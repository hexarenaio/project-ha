const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const connectedUsers = new Set();

//COLORES PARA JUGADOR
//const availableColors = ['blue', 'red', 'green', 'purple', 'orange']; // Puedes agregar más colores según sea necesario
const availableColors = ['blue', 'purple', 'orange', 'pink', 'yellow', 'cyan', 'teal', 'maroon', 'lime', 'brown', 'indigo', 'gray', 'gold', 'silver', 'olive', 'navy', 'magenta', 'peach', 'violet', 'turquoise', 'lavender', 'salmon', 'beige'];

const assignedColors = new Map(); // Mapa para almacenar el color asignado a cada jugador
let colorIndex = 0; // Índice para asignar colores a usuarios

let players = {};

const greenCircles = [];
function getRandomPosition() {
    const x = Math.floor(Math.random() * 800); // Ajusta según el tamaño de tu área de juego
    const y = Math.floor(Math.random() * 800);
    return { x, y };
}


app.use(express.static('public'));

io.on('connection', (socket) => {

    //CONFIRMATION NOMBRE PARA INICIAR SERVER
    socket.on('playerNameEntered', (playerName) => {

        console.log(`Nombre jugador Server: ${playerName}`);

//START SOCKET CONNECTION ///////    ///////    ///////  ///////    ///////    ///////    ///////    ///////    ///////    
///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    ///////    

 
    //USUARIOS CONECTADOS
    console.log(`Total de usuarios: ${connectedUsers.size}`);
    console.log('Nuevo usuario conectado');
    connectedUsers.add(socket.id);
    io.emit('userCount', connectedUsers.size);


socket.emit('allPlayersInfo', players);
   //     io.emit('updatePlayers', players);


    //OBTENER COLOR PARA JUGADOR    
    const colorsArray = Array.from(availableColors);
    const userColor = colorsArray[colorIndex % colorsArray.length];
    colorIndex++;
    assignedColors.set(socket.id, { color: userColor, name: playerName });

/////////ASSIGNED COLOR///////////////

socket.on('assignColor', function (playerName) {
        const userColor = colorsArray[colorIndex % colorsArray.length];
        colorIndex++;
        assignedColors.set(socket.id, { color: userColor, name: playerName });
        console.log(`Jugador ${playerName} conectado. Color asignado: ${userColor}: ${assignedColors.get(socket.id)}`); 
        //Envía una respuesta al cliente con el nombre asignado y el color
        socket.emit('assignColor', { color: userColor, name: playerName });
        io.emit('updatePlayers', players);

});

///////////!!!!!!!!!!!!!//////////////////

    console.log(`Color asignado a ${socket.id}: ${assignedColors.get(socket.id)}`);

//    socket.emit('assignColor', assignedColors.get(socket.id));


    players[socket.id] = {
    //x: Math.random() * 500,
    //y: Math.random() * 500,
    x: 200,
    y: 200,
    color: assignedColors.get(socket.id).color,
    nombre: assignedColors.get(socket.id).name,
    puntos: 0,
    };

//    io.emit('updatePlayers', players); // Envía la información de los jugadores a todos los clientes

    socket.on('updatePosition', function (position) {
    // Actualiza la posición del jugador en el servidor
    players[socket.id].x = position.x;
    players[socket.id].y = position.y;
    // Emite la actualización a todos los clientes
    //io.emit('updatePlayers', players);
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

       socket.emit('assignColor', { color: userColor, name: playerName });
                            io.emit('updatePlayers2', players);

    //   io.emit('updatePlayers', players);


socket.on('updatePlayersRequest', () => {
        // Realiza la acción que deseas ejecutar al recibir la solicitud de updatePlayers
        io.emit('updatePlayers', players);
    });


    ///SISTEMA PUNTOS////////////////////
    socket.on('greenCircleEaten', () => {
    const playerId = socket.id;
    players[playerId].puntos += 1; // Sumar 10 puntos por cada círculo verde comido
    io.emit('updatePlayers', players); 
        // Actualizar la información de los jugadores para todos
                io.emit('updatePlayers2', players);

    console.log(`Puntos actualizados : ${players[playerId].puntos}`);

    });

    //////////////////////   
    
        socket.emit('generateGreenCircles', greenCircles);

	    
generateGreenCircles();

// Función para generar círculos verdes
function generateGreenCircles() {
	if (greenCircles.length<50){
    for (let i = 0; i < 30; i++) {
        const position = getRandomPosition();
        greenCircles.push(position);

    }
	}
    	console.log(`LENGTH0: ${greenCircles.length}:`);
	     //   socket.emit('greenCirclesGenerated', greenCircles);
	        io.emit('greenCirclesGenerated', greenCircles);


}

// Llamar a la función al iniciar el servidor para generar círculos iniciales
//generateGreenCircles();

	console.log(`LENGTH1: ${greenCircles.length}:`);

    // Manejar la generación de nuevos círculos verdes
    socket.on('generateGreenCircles', () => {
        generateGreenCircles();
        	console.log(`LENGTH2: ${greenCircles.length}:`);

    });

	    socket.on('collisionWithGreenCircle', (collisionIndex) => {
    // Verificar si el índice es válido
    if (collisionIndex >= 0 && collisionIndex < greenCircles.length) {
        // Eliminar el círculo verde colisionado
        greenCircles.splice(collisionIndex, 1);
        
        // Emitir evento a todos los clientes para actualizar los círculos verdes
        io.emit('updateGreenCircles', greenCircles);
    }
});



        
    //////////////////////    


    
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
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
