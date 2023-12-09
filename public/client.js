document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let connectedUsers = 0;

    let playerPosition = { x: 0, y: 0 }; // Inicializar la posición del jugador


  const hexagonAngle = 0.523598776; // 30 degrees in radians

//  const hexagonAngle = (2 * Math.PI) / 3; // Ángulo de 120 grados en radianes

  const sideLength = 38;
  let hexHeight, hexRadius, hexRectangleHeight, hexRectangleWidth;

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
    drawCircle((hexRectangleHeight / 2)-2, hexRectangleHeight, 4, "red", playerName);
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



 canvas.addEventListener('click', function (event) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    // Calcular la nueva posición basada en la posición del clic y la geometría de los hexágonos
    const newCirclePosition = calculateNewPosition(clickX, clickY);

    // Enviar la nueva posición al servidor
    socket.emit('updatePosition', newCirclePosition);
  });

  socket.on('circle', function (data) {
    drawCircle(data.x, data.y, data.playerName);
  });

  socket.on('userCount', function (count) {
    connectedUsers = count;
    drawUserCount();
  });

  socket.on('updatePosition', function (data) {
    playerPosition = data;
    drawCircle(playerPosition.x, playerPosition.y, playerName);
  });

  function calculateNewPosition(clickX, clickY) {
  // Ajustes basados en la geometría de un hexágono regular
  const columnIndex = Math.floor(clickX / (hexRectangleWidth * 1.5));
  const rowIndex = Math.floor(clickY / (hexHeight + sideLength));

  const hexX = columnIndex * (hexRectangleWidth * 1.5);
  const hexY = rowIndex * (hexHeight + sideLength);

  // Calcular la posición en el centro del hexágono
  const centerX = hexX + hexRadius;
  const centerY = hexY + hexHeight;

  // Ajustar la posición del círculo para que esté en la esquina superior del hexágono
  const adjustedX = centerX + hexRadius * Math.cos(hexagonAngle);
  const adjustedY = centerY - hexHeight;

  return { x: adjustedX, y: adjustedY };
}



  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    playerName = document.getElementById('playerName').value;
    nameForm.style.display = 'none';
    canvas.style.display = 'block';

    drawHexagons(); // Llama a la función para dibujar hexágonos en el fondo
  });

  // Resto de tu código

});

