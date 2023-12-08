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

      // Dibujar hexágonos en el fondo del canvas
    drawHexagons();


    
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


  // Agregar hexágonos al fondo del canvas
  function drawHexagons() {
    const hexHeight = Math.sin(hexagonAngle) * sideLength;
    const hexRadius = Math.cos(hexagonAngle) * sideLength;
    const hexRectangleHeight = sideLength + 2 * hexHeight;
    const hexRectangleWidth = 2 * hexRadius;

    context.fillStyle = "#000000";
    context.strokeStyle = "#CCCCCC";
    context.lineWidth = 1;

    drawBoard(context, 10, 10); // Puedes ajustar el tamaño del tablero según tus necesidades
  }

  // Esta función dibuja el fondo del canvas con hexágonos
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



  // Función para dibujar el texto con la cantidad de usuarios conectados
  function drawUserCount() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Usuarios conectados: ${connectedUsers}`, 10, 40);
  }
});
