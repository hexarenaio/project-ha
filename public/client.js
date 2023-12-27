document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let connectedUsers = 0;


let isMoving = false


  const hexagonAngle = 0.523598776; // 30 degrees in radians

  let circleX = 50;
  let circleY = 50;

	const players = {}; // Objeto para almacenar la información de los jugadores


  const hexagonGroup = document.getElementById('hexagonGroup');


    const bluePoint = {
        id: socket.id,
        name: '', // Agrega el nombre del jugador
        x: 170, // Posición X inicial del jugador
        y: 170, // Posición Y inicial del jugador
        color: 'blue', // Color azul por defecto
    };


//const bluePoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
   // bluePoint.setAttribute('id', 'bluePoint');
   // bluePoint.setAttribute('cx', '170');
 //   bluePoint.setAttribute('cy', '170');
 //   bluePoint.setAttribute('r', '8');
 //   bluePoint.setAttribute('fill', 'blue');


	// Crear un elemento de texto SVG para mostrar el nombre
  const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.setAttribute('x', bluePoint.x);
  textElement.setAttribute('y', bluePoint.y - 8 - 5); // Ajustar la posición vertical para que esté justo encima del círculo
  textElement.setAttribute('text-anchor', 'middle'); // Centrar el texto horizontalmente
  textElement.setAttribute('fill', 'white');
  textElement.setAttribute('font-size', '12px');
textElement.textContent = 'Hola';




// Agregar el círculo azul al hexagonGroup
    const bluePointElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bluePointElement.setAttribute('id', bluePoint.id);
    bluePointElement.setAttribute('r', '8');
    bluePointElement.setAttribute('fill', bluePoint.color);
bluePointElement.setAttribute('cx', bluePoint.x);
   bluePointElement.setAttribute('cy', bluePoint.y);
 //   hexagonGroup.appendChild(bluePointElement);

	 if (hexagonGroup) {
    hexagonGroup.appendChild(textElement);
  }

/////////////////





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


// Agregar un event listener para clics en el canvas
    hexagonGroup.addEventListener('click', function (event) {
        const mouseX = event.clientX - hexagonGroup.getBoundingClientRect().left;
        const mouseY = event.clientY - hexagonGroup.getBoundingClientRect().top;




		moveBluePoint(mouseX, mouseY);


        // Enviar las nuevas coordenadas al servidor
    });


	socket.on('assignColor', function (color) {
    bluePoint.color = color; // Actualiza el color del jugador local
    bluePointElement.setAttribute('fill', player.color); // Actualiza el color del círculo en el SVG
});



	socket.on('animateBluePoint', function (animationData) {
    const playerId = animationData.playerId;
    const data = animationData.data;

    // Encuentra el círculo correspondiente al jugador
    const playerElement = document.getElementById(playerId);

    // Realiza la animación localmente
    animateCircleLocally(playerElement, data.start, data.end);
  });



	
/*	
socket.on('updatePlayers', function (updatedPlayers) {
  // Itera sobre los jugadores actualizados y actualiza su posición en el mapa
  for (const playerId in updatedPlayers) {
    const updatedPlayer = updatedPlayers[playerId];
    updatePlayerPosition(updatedPlayer);
  }
});
*/

socket.on('updatePlayers', function (updatedPlayers) {
    // Limpiar el hexagonGroup antes de actualizar los jugadores
    //hexagonGroup.innerHTML = '';

    // Iterar sobre el objeto de jugadores y actualizar la información
    for (const playerId in updatedPlayers) {
      const player = updatedPlayers[playerId];
      const playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      playerElement.setAttribute('id', playerId);
      playerElement.setAttribute('r', '8');
      playerElement.setAttribute('fill', player.color);
      playerElement.setAttribute('cx', player.x);
      playerElement.setAttribute('cy', player.y);

	    socket.on('assignColor', function (color) {
    bluePoint.color = color; // Actualiza el color del jugador local
 //   bluePointElement.setAttribute('fill', color); 
		   //   playerElement.setAttribute('fill', player.color);
    
		    // Actualiza el color del círculo en el SVG
});

	    
      hexagonGroup.appendChild(playerElement);
	    
    }
  });



	

	
function updatePlayerPosition(player) {
  // Busca el elemento SVG del jugador por su identificación y actualiza la posición
  const playerElement = document.getElementById(player.id);
  if (playerElement) {
    playerElement.setAttribute('cx', player.x);
    playerElement.setAttribute('cy', player.y);
  }
}



	function animateCircleLocally(circleElement, start, end) {
  const duration = 100; // Duración en milisegundos
  const startTime = performance.now();

  function update() {
    const currentTime = performance.now();
    const progress = Math.min((currentTime - startTime) / duration, 1);

    const newX = start.x + progress * (end.x - start.x);
    const newY = start.y + progress * (end.y - start.y);

    circleElement.setAttribute('cx', newX);
    circleElement.setAttribute('cy', newY);




       

    
 //   socket.emit('updatePosition', { x: newX, y: newY });




    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}



	/*
	

   socket.on('updatePlayers', function (updatedPlayer) {
    // Actualizar la posición del jugador en el hexagonGroup
    updatePlayerPosition(updatedPlayer);
});

// Función para actualizar la posición del jugador en el hexagonGroup
function updatePlayerPosition(player) {
	    console.log(`Actualizando posición para ${player.id} a (${player.x}, ${player.y})`);

    const playerElement = document.getElementById(player.id);
    if (playerElement) {
        playerElement.setAttribute('cx', player.x);
        playerElement.setAttribute('cy', player.y);
    }
}


*/


createHexagons();

	
const helloText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  helloText.setAttribute('x', '50%'); // Centrar horizontalmente
  helloText.setAttribute('y', '20'); // Ajustar verticalmente
  helloText.setAttribute('text-anchor', 'middle'); // Alinear al centro
  helloText.setAttribute('fill', 'black');
  helloText.setAttribute('font-size', '16px');
  helloText.textContent = 'Hola';

  //canvas.appendChild(helloText);

   // hexagonGroup.appendChild(bluePoint);

 // Llama a la función para dibujar hexágonos en el fondo



	
 
//  const hexagonAngle = (2 * Math.PI) / 3; // Ángulo de 120 grados en radianes

  const sideLength = 38;
  let hexHeight, hexRadius, hexRectangleHeight, hexRectangleWidth;

   let lastCircleX = (hexRectangleHeight / 2) - 2;
let lastCircleY = hexRectangleHeight;


  // Esta función dibuja el fondo del canvas con hexágonos
  function drawHexagons() {
    hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
    hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;


    context.fillStyle = "#000000";
    context.strokeStyle = "#CCCCCC";
    context.lineWidth = 1;

    drawBoard(context, 10, 10); // Puedes ajustar el tamaño del tablero según tus necesidades

     const randomX = Math.random() * canvas.width;
    const randomY = Math.random() * canvas.height;

    // Dibujar un círculo rojo en la posición aleatoria
    drawCircle(circleX, circleY, 4, "red", playerName);
  }

function updateCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
 // drawHexagons();

  // Verificar si el círculo está dentro de un hexágono
  const hexRow = Math.floor(circleY / (sideLength + hexHeight));
  const hexCol = Math.floor(circleX / hexRectangleWidth);

  // Calcular la posición central del hexágono correspondiente
  const hexCenterX = hexCol * hexRectangleWidth + ((hexRow % 2) * hexRadius);
  const hexCenterY = hexRow * (sideLength + hexHeight) + (hexHeight + sideLength);

  // Calcular la distancia desde el centro del hexágono al círculo
  const distance = Math.sqrt(Math.pow(circleX - hexCenterX, 2) + Math.pow(circleY - hexCenterY, 2));

  // Si la distancia es menor que el radio del hexágono, el círculo está dentro
  if (distance < hexRadius) {
    // Permitir que el círculo se mueva si está dentro del hexágono
    drawCircle(circleX, circleY, 4, 'red', playerName);
  } else {
    // Si está fuera, volver a la posición anterior (dentro del hexágono)
    drawCircle(lastCircleX, lastCircleY, 4, 'red', playerName);
  }
}


  // Agregar un event listener para clics en el canvas
  canvas.addEventListener('click', function (event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Calcular la dirección del clic y mover el círculo
    const deltaX = mouseX - circleX;
    const deltaY = mouseY - circleY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Mover 20 pixeles en la dirección del clic (normalizado)
    circleX += (deltaX / distance) * 20;
    circleY += (deltaY / distance) * 20;

    // Actualizar el canvas después de mover el círculo
    updateCanvas();
  });

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

  function getHexagonPoints(x, y, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (2 * Math.PI / 6) * i;
      const pointX = x + size * Math.cos(angle);
      const pointY = y + size * Math.sin(angle);
      points.push(`${pointX},${pointY}`);
    }
    return points.join(' ');
  }

  

  // Esta función dibuja un hexágono en el canvas
  function drawHexagon(canvasContext, x, y, fill) {
    const fillHex = fill || false;

    canvasContext.beginPath();
    canvasContext.moveTo(x + hexRadius, y);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
    canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
    canvasContext.lineTo(x, y + sideLength + hexHeight);
    canvasContext.lineTo(x, y + hexHeight);
    canvasContext.closePath();

    if (fillHex) {
      canvasContext.fill();
    } else {
      canvasContext.stroke();
    }
  }

  function drawBoard(canvasContext, width, height) {
    let i, j;

    for (i = 0; i < width; ++i) {
      for (j = 0; j < height; ++j) {
        drawHexagon(
          context,
          i * hexRectangleWidth + ((j % 2) * hexRadius),
          j * (sideLength + hexHeight),
          false
        );
      }
    }
  }


function drawCircle(x, y, radius, color, text) {
  // Calcular la posición ajustada para que el círculo esté en la esquina superior del hexágono
  
  //const adjustedX = x + hexRadius * Math.cos(hexagonAngle);
//  const adjustedY = y - hexHeight;

   const adjustedX = x;
  const adjustedY = y;


  context.beginPath();
  context.arc(adjustedX, adjustedY, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();

  // Mostrar el nombre del jugador encima del círculo
  context.fillStyle = 'white';
  context.font = '12px Arial';
  context.fillText(text, adjustedX - 20, adjustedY - 15);
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
   
    //CODE END////////////////////////////////////////
    /////////////////////////////////////////////////
    
/*function animateBluePoint(destinationX, destinationY, callback) {
    const startX = parseFloat(bluePointElement.getAttribute('cx'));
    const startY = parseFloat(bluePointElement.getAttribute('cy'));

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

	socket.emit('updatePosition', { x: newX, y: newY });

        
      //  detectarColisiones();

        if (progress < 1) {
            requestAnimationFrame(update);
            
            
            
          ////DETECTOR DE COLISIONES
         
            
            
                      ////DETECTOR DE COLISIONES

            
            
             
        } else {
            // Llamada a la devolución de llamada cuando la animación ha terminado
            if (callback) {
                callback();
            }
        }
    }

    requestAnimationFrame(update);
}
*/

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
	



    //  document.addEventListener('click', moveBluePoint);





      /*

  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    playerName = document.getElementById('playerName').value;
    nameForm.style.display = 'none';
    canvas.style.display = 'block';

  //  drawHexagons(); // Llama a la función para dibujar hexágonos en el fondo

        hexagonGroup.style.display = 'block';
        bluePoint.style.display = 'block';

        console.log('nameForm Comenzado');

	  // Dibujar el texto con la cantidad de usuarios conectados


  });


*/



	////////////SERVER COSAS///////////



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
