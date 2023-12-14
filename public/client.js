document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let connectedUsers = 0;

  const hexagonAngle = 0.523598776; // 30 degrees in radians

  let circleX = 50;
  let circleY = 50;

  const hexagonGroup = document.getElementById('hexagonGroup');
  createHexagons(); // Llama a la función para dibujar hexágonos en el fondo



 
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







  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    playerName = document.getElementById('playerName').value;
    nameForm.style.display = 'none';
    canvas.style.display = 'block';

  //  drawHexagons(); // Llama a la función para dibujar hexágonos en el fondo

        hexagonGroup.style.display = 'block';

  });

  // Resto de tu código

});
