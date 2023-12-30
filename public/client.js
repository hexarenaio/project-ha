document.addEventListener('DOMContentLoaded', function () {

  //VARIABLES
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

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
 //   hexagonGroup.appendChild(bluePointElement);

//TEXT NAME DEFINIDO
const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.setAttribute('x', bluePoint.x);
  textElement.setAttribute('y', bluePoint.y - 8 - 5); // Ajustar la posición vertical para que esté justo encima del círculo
  textElement.setAttribute('text-anchor', 'middle'); // Centrar el texto horizontalmente
  textElement.setAttribute('fill', 'red');
  textElement.setAttribute('font-size', '12px');
  textElement.textContent = 'Hola';

	


//GROUP ELEMENT CIRCULO Y TEXTO
const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  // Agregar el círculo al grupo
  groupElement.appendChild(bluePointElement);
  // Agregar el texto al grupo
  groupElement.appendChild(textElement);
  // Asegúrate de que hexagonGroup esté disponible antes de agregar el grupo
  if (hexagonGroup) {
    hexagonGroup.appendChild(groupElement);
  }
//////////////////

			//const playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//hexagonGroup.appendChild(playerElement);


	
//CLICK LISTENER HEAGONGROUP
    hexagonGroup.addEventListener('click', function (event) {
	            console.log('HEXAGON GROUP LOG');

        const mouseX = event.clientX - hexagonGroup.getBoundingClientRect().left;
        const mouseY = event.clientY - hexagonGroup.getBoundingClientRect().top;
		moveBluePoint(mouseX, mouseY);
    });
	



	
	//SERVER ANIMATEBLUEPOINT
	socket.on('animateBluePoint', function (animationData) {
		        console.log('SOCKET ANIMATE BLUE POINT');

    const playerId = animationData.playerId;
    const data = animationData.data;
    // Encuentra el círculo correspondiente al jugador
    const playerElement = document.getElementById(playerId);
        


    // Realiza la animación localmente
    animateCircleLocally(playerElement, data.start, data.end);
  });

	



	
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
    }
  });



	
function updatePlayerPosition(player) {
	        console.log('UPDATE PLAYER POSITION');

  // Busca el elemento SVG del jugador por su identificación y actualiza la posición
  const playerElement = document.getElementById(player.id);
  if (playerElement) {
    playerElement.setAttribute('cx', player.x+13);
    playerElement.setAttribute('cy', player.y+16);
  }
}


	function animateCircleLocally(circleElement, start, end) {
		        console.log('ANIMATE CIRCLE LOCALLY');

  const duration = 100; // Duración en milisegundos
  const startTime = performance.now();

  function update() {
    const currentTime = performance.now();
    const progress = Math.min((currentTime - startTime) / duration, 1);

    const newX = start.x + progress * (end.x - start.x);
    const newY = start.y + progress * (end.y - start.y);

   circleElement.setAttribute('cx', newX);
   circleElement.setAttribute('cy', newY);


    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


createHexagons();



  const sideLength = 38;
  let hexHeight, hexRadius, hexRectangleHeight, hexRectangleWidth;

   let lastCircleX = (hexRectangleHeight / 2) - 2;
let lastCircleY = hexRectangleHeight;









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

  


  function moveBluePoint( clickX, clickY ) {




if (!isMoving) { 

console.log('/////MOVE PLAYER//////')

  isMoving = true  



	      drawUserCount();

     
        console.log('///////////////////');

  		//const clickX = event.clientX;
  	//const clickY = event.clientY - 40;




//const clickX2 = clickEvent.offsetX;
 //const clickY2 = clickEvent.offsetY;
      
   
  		const closestLine = findClosestLine(
        bluePointElement.getAttribute('cx'), bluePointElement.getAttribute('cy'));

    	
            
             const destinationX = closestLine.x2;
        const destinationY = closestLine.y2;

        
        animateBluePoint(destinationX, destinationY, function() {
 
    
    findClosestVertices(bluePointElement.getAttribute('cx'), 	
                           bluePointElement.getAttribute('cy'));



//const groupTransformAttribute = groupElement.getAttribute('transform');
//findClosestVerticesFromTransform(groupTransformAttribute);



                console.log('Mov finalizado'); 
});

        
           	
            findClosestRedVertexToClick( clickX, clickY);


}

	
	}




//FIND CLOSEST VERTICES//////////////////////////
    /////////////////////////////////////////////////
    
	// Definir un arreglo para almacenar las coordenadas de los vértices rojos
	
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
          //  (${closestVertex.x}, ${closestVertex.y})`);
            
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

        groupElement.setAttribute('transform', `translate(${newX},${newY})`);

	    
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Animación completada, emitir datos al servidor
            socket.emit('animationData', { start: { x: startX, y: startY }, end: { x: newX, y: newY } });





socket.on('assignColor', function (color) {
    bluePoint.color = color; // Actualiza el color del jugador local
    bluePointElement.setAttribute('fill', color);
    console.log(`Color asignado al jugador local: ${color}`);
});

        findClosestVertices(bluePointElement.getAttribute('cx'),                         bluePointElement.getAttribute('cy'));


//const groupTransformAttribute = //groupElement.getAttribute('transform');
//findClosestVerticesFromTransform(groupTransformAttribute);


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

 
findClosestVertices(bluePointElement.getAttribute('cx'), 				bluePointElement.getAttribute('cy'));
   



//findClosestVertices(groupElement.getAttribute('transform'));


 console.log('La animación ha terminado');
    


// Puedes realizar acciones adicionales después de que la animación ha terminado


});


    
        	//console.log(`Vértice rojo más cercano a (${x}, ${y}): 
           // (${closestVertex.x}, ${closestVertex.y})`);
    	} else {
        console.log(`No se encontró vértice rojo cercano a las coordenadas (${x}, ${y}).`);
    	}

    return closestVertex;
	}
	

	////////////SERVER COSAS///////////


function findClosestVerticesFromTransform(transformAttribute) {
    const transformValues = transformAttribute.match(/translate\(([^,]+),([^)]+)\)/);

    if (transformValues) {
        const translateX = parseFloat(transformValues[1]);
        const translateY = parseFloat(transformValues[2]);

        // Now you can use translateX and translateY as the group's new position
        // Call findClosestVertices with these coordinates
        const nearbyVertices = findClosestVertices(translateX, translateY);

        // Optionally, do something with the nearbyVertices

        return nearbyVertices;
    } else {
        console.error('Invalid transform attribute format');
        return null;
    }
}




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


	 // Manejar la recepción de información sobre la cantidad de usuarios conectados
  socket.on('userCount', function (count) {
    connectedUsers = count;
    drawUserCount(); // Llamar a la función para actualizar el texto en el canvas
  });

	 // Función para dibujar el texto con la cantidad de usuarios conectados
  function drawUserCount() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Usuarios conectados: ${connectedUsers}`, 10, 5);
  }

  // Resto de tu código

});
