//SOCKET.ON SIGNIFICA QUE ESTA ESCUCHANDO AL SERVIDOR. Son datos que vienen del servidor.

document.addEventListener('DOMContentLoaded', function () {

  //VARIABLES
  const socket = io();
  const nameForm = document.getElementById('nameForm');
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  let playerName;
  let connectedUsers = 0;

  let isMoving = false

  const hexagonAngle = 0.523598776; // 30 degrees in radians

  let circleX = 250;
  let circleY = 250;

  const players = {}; // Objeto para almacenar la información de los jugadores

  const hexagonGroup = document.getElementById('hexagonGroup');

  const bluePoint = {
	id: socket.id,
        name: '', // Agrega el nombre del jugador
        x: 170, // Posición X inicial del jugador
        y: 170, // Posición Y inicial del jugador
        color: 'blue', // Color azul por defecto
    };

//CIRCULO AZUL DEFINIDO
const bluePointElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bluePointElement.setAttribute('id', bluePoint.id);
    bluePointElement.setAttribute('r', '8');
    bluePointElement.setAttribute('fill', bluePoint.color);
    bluePointElement.setAttribute('cx', bluePoint.x);
    bluePointElement.setAttribute('cy', bluePoint.y);
    //hexagonGroup.appendChild(bluePointElement);

//TEXT NAME DEFINIDO
const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.setAttribute('x', bluePoint.x);
  textElement.setAttribute('y', bluePoint.y - 8 - 5); 
  textElement.setAttribute('text-anchor', 'middle');
  textElement.setAttribute('fill', 'red');
  textElement.setAttribute('font-size', '12px');
  textElement.textContent = 'Hola';


//TEXT NAME DEFINIDO 222222222
const textElement2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement2.setAttribute('x', 170);
  textElement2.setAttribute('y', 170); 
  textElement2.setAttribute('text-anchor', 'middle');
  textElement2.setAttribute('fill', 'green');
  textElement2.setAttribute('font-size', '14px');
  textElement2.textContent = 'Player';

//GROUP ELEMENT CIRCULO Y TEXTO
const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  //groupElement.appendChild(bluePointElement);
  groupElement.appendChild(textElement);
  if (hexagonGroup) {
  // 	hexagonGroup.appendChild(groupElement);
  }

groupElement.setAttribute('transform', `translate(${bluePoint.x},${bluePoint.y})`); 

//////////////////
	
//CLICK LISTENER HEAGONGROUP
hexagonGroup.addEventListener('click', function (event) {
	console.log('HEXAGON GROUP LOG');
	const mouseX = event.clientX - hexagonGroup.getBoundingClientRect().left;
        const mouseY = event.clientY - hexagonGroup.getBoundingClientRect().top;
	moveBluePoint(mouseX, mouseY);
});
	
//SERVER ANIMATEBLUEPOINT
//SOCKET.ON SIGNIFICA QUE ESTA ESCUCHANDO AL SERVIDOR. Son datos que vienen del servidor.
socket.on('animateBluePoint', function (animationData) {
	console.log('SOCKET ANIMATE BLUE POINT');
	const playerId = animationData.playerId;
    	const data = animationData.data;
    	// Encuentra el círculo correspondiente al jugador
    	const playerElement = document.getElementById(playerId);
    	// Realiza la animación localmente    
	
	animateCircleLocally(playerElement, data.start, data.end);
});

//SERVER UPDATEPLAYERS
//SOCKET.ON SIGNIFICA QUE ESTA ESCUCHANDO AL SERVIDOR. Son datos que vienen del servidor.
socket.on('updatePlayers', function (updatedPlayers) {
	console.log('SOCKET UPDATE PLAYERS');
	 // Iterar sobre el objeto de jugadores y actualizar la información
    	for (const playerId in updatedPlayers) {
      	const player = updatedPlayers[playerId];
      	const playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      	playerElement.setAttribute('id', playerId);
      	playerElement.setAttribute('r', '12');
      	playerElement.setAttribute('fill', player.color);
      	playerElement.setAttribute('cx', player.x);
      	playerElement.setAttribute('cy', player.y);
	hexagonGroup.appendChild(playerElement);

	//TEXT ELEMENT 2	
	hexagonGroup.appendChild(textElement2);

	//GroupElement
        groupElement.setAttribute('transform', `translate(${player.x},${player.y})`); 
  	hexagonGroup.appendChild(groupElement);
		

    	}
  });

//SERVER UPDATEPLAYERPOSITION
function updatePlayerPosition(player) {
	console.log('UPDATE PLAYER POSITION');
	// Busca el elemento SVG del jugador por su identificación y actualiza la posición
  	const playerElement = document.getElementById(player.id);
  	if (playerElement) {
    		playerElement.setAttribute('cx', player.x);
    		playerElement.setAttribute('cy', player.y);
  	}
}

//ANIMATE CIRCLE LOCALLY
function animateCircleLocally(circleElement, start, end) {
	console.log('ANIMATE CIRCLE LOCALLY');
	const duration = 100;
  	const startTime = performance.now();
	function update() {
    	const currentTime = performance.now();
    	const progress = Math.min((currentTime - startTime) / duration, 1);
	const newX = start.x + progress * (end.x - start.x);
    	const newY = start.y + progress * (end.y - start.y);
	circleElement.setAttribute('cx', newX);
   	circleElement.setAttribute('cy', newY);

	textElement2.setAttribute('x', newX);
   	textElement2.setAttribute('y', newY - 8);

	groupElement.setAttribute('transform', `translate(${newX},${newY})`); 

    	if (progress < 1) {
      	requestAnimationFrame(update);
    	}
  	}
	requestAnimationFrame(update);
}

//CREATE HEXAGON PANAL
createHexagons();
	
//MOVE BLUE POINT
function moveBluePoint( clickX, clickY ) {
	if (!isMoving) { 
	console.log('/////MOVE PLAYER//////')
  	isMoving = true  
	drawUserCount();
	/*const closestVertex = findClosestVertices(bluePointElement.getAttribute('cx'), bluePointElement.getAttribute('cy'));
	const destinationX = closestVertex.x;
        const destinationY = closestVertex.y;
	console.log(`ClosestVertex: (${closestVertex.x}, ${closestVertex.y})`);
	animateBluePoint(destinationX, destinationY, function() {
     	findClosestVertices(bluePointElement.getAttribute('cx'), bluePointElement.getAttribute('cy'));
        console.log('Mov finalizado'); 
	});
	*/
		
	const closestLine = findClosestLine(
        bluePointElement.getAttribute('cx'), bluePointElement.getAttribute('cy'));
	const destinationX = closestLine.x2;
        const destinationY = closestLine.y2;
		
	animateBluePoint(destinationX, destinationY, function() {
        findClosestVertices(bluePointElement.getAttribute('cx'), bluePointElement.getAttribute('cy'));
	console.log('Mov finalizado'); 
	});
		
	findClosestRedVertexToClick( clickX, clickY);
		
	}
  }

//ANIMATE BLUE POINT//////////////////////////
/////////////////////////////////////////////////
function animateBluePoint(destinationX, destinationY) {
	const startX = parseFloat(bluePointElement.getAttribute('cx'));
    	const startY = parseFloat(bluePointElement.getAttribute('cy'));
	console.log(`startX: ${startX}`);
 	console.log(`startY: ${startY}`);
	const startTime = performance.now();
    	const duration = 100; // 1 segundo
	function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newX = startX + progress * (destinationX - startX);
        const newY = startY + progress * (destinationY - startY);
		
    	bluePointElement.setAttribute('cx', newX);
    	bluePointElement.setAttribute('cy', newY);
		
      	//groupElement.setAttribute('transform', `translate(${newX},${newY})`);    
        if (progress < 1) {
        requestAnimationFrame(update);
        } else {
        	// Animación completada, emitir datos al servidor
        
	socket.emit('animationData', { start: { x: startX, y: startY }, end: { x: newX, y: newY } });

	//SOCKET.ON SIGNIFICA QUE ESTA ESCUCHANDO AL SERVIDOR. Son datos que vienen del servidor.	
	socket.on('assignColor', function (color) {
    	bluePoint.color = color; // Actualiza el color del jugador local
    	bluePointElement.setAttribute('fill', color);
    	console.log(`Color asignado al jugador local: ${color}`);
	});
		
	findClosestVertices(bluePointElement.getAttribute('cx'), bluePointElement.getAttribute('cy'));
		
	console.log('Mov finalizado');
	isMoving = false
	}
    	}
	requestAnimationFrame(update);
}


//FIND CLOSES TO CLICK///////////////////////////
///////////////////////////////////////////////// 
function findClosestRedVertexToClick(x, y) {
    	let closestVertex = null;
    	let minDistance = Infinity;
    	redVerticesArray.forEach((redVertex) => {
        const x1 = redVertex.x;
        const y1 = redVertex.y;
        const distance = pointToPointDistance2(x, y, x1, y1);
        if (distance < minDistance) {
        minDistance = distance;
        closestVertex = { x: x1, y: y1 };
        }
    	});
    	if (closestVertex) {
    	//bluePoint.setAttribute('cx',  closestVertex.x );
    	//bluePoint.setAttribute('cy',  closestVertex.y  );          
	animateBluePoint(closestVertex.x, closestVertex.y, function() { 
	findClosestVertices(bluePointElement.getAttribute('cx'), bluePointElement.getAttribute('cy'));
 	console.log('La animación ha terminado');
	});
        //console.log(`Vértice rojo más cercano a (${x}, ${y}): // (${closestVertex.x}, ${closestVertex.y})`);
    	} else {
        console.log(`No se encontró vértice rojo cercano a las coordenadas (${x}, ${y}).`);
    	}
    	return closestVertex;
}

//FIND CLOSEST VERTICES//////////////////////////
/////////////////////////////////////////////////	
let redVerticesArray = [];
function findClosestVertices(x, y) {
    	const hexagons = document.querySelectorAll('#hexagonGroup polygon');
    	let svg = document.querySelector('svg');
    	let nearbyVertices = [];
    	// Eliminar los puntos rojos existentes
    	redVerticesArray.forEach((redVertex) => {
        const existingRedDot = document.querySelector
        (`circle[fill="red"][cx="${redVertex.x}"][cy="${redVertex.y}"]`);
        if (existingRedDot) {
        svg.removeChild(existingRedDot);
        }
    	});
    	// Limpiar el arreglo de coordenadas de los vértices rojos
    	redVerticesArray = [];
	hexagons.forEach((hexagon) => {
        const points = hexagon.getAttribute('points').split(' ');
        // Iteramos sobre los vértices del hexágono
        for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i].split(',').map(Number);
	// Calculamos la distancia entre el punto azul y el vértice
        const distance = pointToPointDistance2(x, y, x1, y1);
	// Marcamos el vértice si está dentro del radio de 50 pixeles alrededor del punto azul
        if (distance < 60) {
        nearbyVertices.push({ x: x1, y: y1 });
	// Almacenamos las coordenadas del vértice rojo
        redVerticesArray.push({ x: x1, y: y1 });
	// Dibujamos un círculo rojo en el vértice
        const redDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        redDot.setAttribute('cx', x1);
        redDot.setAttribute('cy', y1);
        redDot.setAttribute('r', '3');
        redDot.setAttribute('fill', 'red');
	svg.appendChild(redDot);
	// Mostramos las coordenadas en la consola
        //console.log(`Vértice (${x1}, ${y1}) marcado con círculo rojo.`);
        }
        }
    	});
    	// Encontramos el vértice rojo más cercano al clic
    	const clickX = x;
    	const clickY = y;
    	let closestVertex = null;
    	let minDistance = Infinity;
    	redVerticesArray.forEach((redVertex) => {
        const x1 = redVertex.x;
        const y1 = redVertex.y;
	const distance = pointToPointDistance2(clickX, clickY, x1, y1);
        if (distance < minDistance) {
        minDistance = distance;
        closestVertex = { x: x1, y: y1 };
	}
    	});
	if (closestVertex) {
        //console.log(`Vértice rojo más cercano al clic: 
        //(${closestVertex.x}, ${closestVertex.y})`);
        } else {
        console.log('No se encontraron vértices rojos cercanos');
	}
    	return nearbyVertices;
}
	
//POINT TO DISTANCE//////////////////////////////
/////////////////////////////////////////////////
function pointToPointDistance2(x1, y1, x2, y2) {
    	const dx = x1 - x2;
    	const dy = y1 - y2;
    	return Math.sqrt(dx * dx + dy * dy);
}

  

//CREATE HEXAGONS///////////////////////////
///////////////////////////////////////////////// 
function createHexagons() {
    const hexagonSize = 50;
    const numRows = 20;
    const numCols = 40;
    const hexWidth = hexagonSize * Math.sqrt(3);
    const hexHeight = hexagonSize * Math.sqrt(3);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = col * (hexWidth * 0.87);
        const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
        const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        hexagon.setAttribute('points', getHexagonPoints(x, y, hexagonSize));
        hexagon.setAttribute('fill', 'none');
        hexagon.setAttribute('stroke', 'gray');
        hexagon.setAttribute('stroke-width', '2');
        hexagon.addEventListener('click', function () {
          // Agregar el manejo de clic en hexágono aquí si es necesario
        });
        hexagonGroup.appendChild(hexagon);
      }
    }
  }


//GET HEXAGON POINTS///////////////////////////
///////////////////////////////////////////////// 
  function getHexagonPoints(x, y, size) {
	console.log('Hexagon Points');
    	const points = [];
    	for (let i = 0; i < 6; i++) {
      		const angle = (2 * Math.PI / 6) * i;
      		const pointX = x + size * Math.cos(angle);
      		const pointY = y + size * Math.sin(angle);
      		points.push(`${pointX},${pointY}`);
    	}
    	return points.join(' ');
  }

//CONNECTED USERS////////////////////////////////
///////////////////////////////////////////////// 
//SOCKET.ON SIGNIFICA QUE ESTA ESCUCHANDO AL SERVIDOR. Son datos que vienen del servidor.
  socket.on('userCount', function (count) {
    connectedUsers = count;
    drawUserCount(); // Llamar a la función para actualizar el texto en el canvas
  });
  function drawUserCount() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Usuarios conectados: ${connectedUsers}`, 10, 5);
  }

		
//END CODE DOM///////////////////////////////////
///////////////////////////////////////////////// 

	//FIND CLOSEST LINE//////////////////////////////
    /////////////////////////////////////////////////
    
	function findClosestLine(x, y) {

    //console.log('1. Coordenadas Azul:', 
  //  bluePoint.getAttribute('cx'), bluePoint.getAttribute('cy'));
   
      const lines = document.querySelectorAll('#hexagonGroup polygon');
      let closestLine = null;
      let minDistance = Infinity;

      lines.forEach((hexagon) => {
        const points = hexagon.getAttribute('points').split(' ');
        for (let i = 0; i < points.length; i++) {
          const [x1, y1] = points[i].split(',').map(Number);
          const [x2, y2] = points[(i + 1) % points.length].split(',').map(Number);

          const distance = pointToLineDistance(x, y, x1, y1, x2, y2);
          if (distance < minDistance) {
     
            minDistance = distance;
            closestLine = { x1, y1, x2, y2 };
          }
        }
      });

      return closestLine;
    }
   
    //POINT TO LINE DISTANCE//////////////////////////
    /////////////////////////////////////////////////

    function pointToLineDistance(x, y, x1, y1, x2, y2) {
   
      const A = x - x1;
      const B = y - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      const param = dot / len_sq;

      let xx, yy;

      if (param < 0 || (x1 === x2 && y1 === y2)) {
        xx = x1;
        yy = y1;
   
      } else if (param > 1) {

        xx = x2;
        yy = y2;
      } else {
   
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      const dx = x - xx;
      const dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy);
    }
   
    //CODE END////////////////////////////////////////
    /////////////////////////////////////////////////
	
	
});
