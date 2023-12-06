document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let connectedUsers = 0; // Variable para almacenar la cantidad de usuarios conectados

  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    playerName = document.getElementById('playerName').value;
    nameForm.style.display = 'none';
    canvas.style.display = 'block';

    drawHexGrid(context);

    
  });

  // Manejar la creación de círculos
  canvas.addEventListener('click', function (event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    // Enviar la información del círculo al servidor
    socket.emit('circle', { x, y, playerName });
  });

  // Manejar la recepción de círculos del servidor
  socket.on('circle', function (data) {
    drawCircle(data.x, data.y, data.playerName);
  });

  // Manejar la recepción de información sobre la cantidad de usuarios conectados
  socket.on('userCount', function (count) {
    connectedUsers = count;
    drawUserCount(); // Llamar a la función para actualizar el texto en el canvas
  });

  // Función para dibujar un círculo en el canvas con el nombre del jugador
  function drawCircle(x, y, playerName) {
    context.clearRect(0, 0, canvas.width, 30); // Limpiar la parte superior del canvas

    // Dibujar el texto con la cantidad de usuarios conectados
    drawUserCount();

    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();

    // Mostrar el nombre del jugador encima del círculo
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.fillText(playerName, x - 20, y - 15);
  }

  // Función para dibujar la malla de hexágonos
  function drawHexGrid(canvasContext) {
    var hexHeight,
      hexRadius,
      hexRectangleHeight,
      hexRectangleWidth,
      hexagonAngle = 0.523598776, // 30 degrees in radians
      sideLength = 9,
      boardWidth = 13,
      boardHeight = 13;

    hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
    hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;

    canvasContext.fillStyle = "#000000";
    canvasContext.strokeStyle = "#CCCCCC";
    canvasContext.lineWidth = 1;

    drawBoard(canvasContext, boardWidth, boardHeight);
  }

  function drawBoard(canvasContext, width, height) {
    var i, j, hexagons, xStart;
    // Este bucle genera una cuadrícula de hexágonos rectangular
    for (i = 0; i < height; i++) {
      hexagons = width - (Math.abs(Math.floor(width / 2) - i));
      xStart = (width - 3) % 4 == 0 ? Math.ceil((width - hexagons) / 2) : Math.floor((width - hexagons) / 2);

      for (j = xStart; j < xStart + hexagons; j++) {
        drawHexagon(
          canvasContext,
          j * hexRectangleWidth + ((i % 2) * hexRadius),
          i * (sideLength + hexHeight),
          false
        );
      }
    }
  }

  function drawHexagon(canvasContext, x, y, fill) {
    var fill = fill || false;

    canvasContext.beginPath();
    canvasContext.moveTo(x + hexRadius, y);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
    canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
    canvasContext.lineTo(x, y + sideLength + hexHeight);
    canvasContext.lineTo(x, y + hexHeight);
    canvasContext.closePath();

    if (fill) {
      canvasContext.fill();
    } else {
      canvasContext.stroke();
    }
  }

 

  // Función para dibujar el texto con la cantidad de usuarios conectados
  function drawUserCount() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Usuarios conectados: ${connectedUsers}`, 10, 40);
  }
});
