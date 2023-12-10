document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let connectedUsers = 0;

  const hexagonAngle = 0.523598776; // 30 degrees in radians



 
//  const hexagonAngle = (2 * Math.PI) / 3; // Ángulo de 120 grados en radianes

  const sideLength = 38;
  let hexHeight, hexRadius, hexRectangleHeight, hexRectangleWidth;

   hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
   hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;

    let circleX = (hexRectangleHeight / 2) - 2;
  let circleY = hexRectangleHeight;
  let lastCircleX = circleX;
  let lastCircleY = circleY;

  
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
  drawHexagons();


}


  // Agregar un event listener para clics en el documento
  document.addEventListener('mousedown', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Verificar si el clic está dentro del área del canvas
    if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
      // Redondear las coordenadas a múltiplos de la longitud del lado del hexágono (38 píxeles)
      const roundedX = Math.round(mouseX / sideLength) * sideLength;
      const roundedY = Math.round(mouseY / (sideLength + hexHeight)) * (sideLength + hexHeight);

      // Mover el círculo hacia la posición redondeada
      circleX = roundedX;
      circleY = roundedY;

      // Actualizar la última posición válida
      lastCircleX = circleX;
      lastCircleY = circleY;

      // Actualizar el canvas después de mover el círculo
      updateCanvas();
    }
  });
  

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

    drawHexagons(); // Llama a la función para dibujar hexágonos en el fondo
  });

  // Resto de tu código

});
