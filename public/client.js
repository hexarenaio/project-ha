document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let connectedUsers = 0;


  const hexagonAngle = 0.523598776; // 30 degrees in radians

  // Crea el grupo de hexágonos
  const hexagonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  hexagonGroup.setAttribute('id', 'hexagonGroup');
  canvas.appendChild(hexagonGroup);



 
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


    const lineSpacing = sideLength / 2;

  
  // Esta función dibuja el fondo del canvas con hexágonos
  function drawHexagons222() {
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


 // Agregar un event listener para clics en el documento
  document.addEventListener('mousedown', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Verificar si el clic está dentro del área del canvas
    if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
      // Calcular la posición Y más cercana en la malla hexagonal
      const nearestY = Math.round(mouseY / (sideLength + hexHeight)) * (sideLength + hexHeight);

      // Mover el círculo solo si la posición Y coincide con una línea blanca
      if (Math.abs(nearestY - mouseY) < lineSpacing / 2) {
        // Mover el círculo solo si la distancia es menor o igual a la mitad de la longitud del lado del hexágono
        circleX = mouseX;
        circleY = nearestY;

        // Actualizar la última posición válida
        lastCircleX = circleX;
        lastCircleY = circleY;

        // Actualizar el canvas después de mover el círculo
        updateCanvas();
      }
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


   function drawHexagonSVG(x, y, size) {
    const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hexagon.setAttribute('points', getHexagonPoints(x, y, size));
    hexagon.setAttribute('fill', 'none');
    hexagon.setAttribute('stroke', 'gray');
    hexagon.setAttribute('stroke-width', '2');
    hexagonGroup.appendChild(hexagon);
  }

  // Esta función dibuja el fondo del canvas con hexágonos
  function drawHexagons() {
  let hexagonGroup;

     const hexagonSize = 50;
      const numRows = 20;
      const numCols = 40;
      const hexWidth = hexagonSize * Math.sqrt(3);
      const hexHeight = hexagonSize * Math.sqrt(3);

        console.log('La animación ha terminado');

 

  // Resto de tu código

   

    // Crea hexágonos en el fondo utilizando la función existente
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = col * (hexWidth * 0.87);
        const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
        drawHexagonSVG(x, y, hexagonSize);
      }
    }

    // Resto de tu lógica de dibujo
    drawBoard(context, 10, 10);
    drawCircle(circleX, circleY, 4, "red", playerName);
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



   function createHexagons() {
   
      const hexagonSize = 50;
      const numRows = 20;
      const numCols = 40;
      const hexWidth = hexagonSize * Math.sqrt(3);
      const hexHeight = hexagonSize * Math.sqrt(3);
      //1.732

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const x = col * (hexWidth * 0.87);
          const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
          const hexagon =
  		  document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          hexagon.setAttribute('points', getHexagonPoints(x, y, hexagonSize));
          hexagon.setAttribute('fill', 'none');
          hexagon.setAttribute('stroke', 'gray');
          hexagon.setAttribute('stroke-width', '2');

          hexagonGroup.appendChild(hexagon);
        }
      }
    }


  
    //GET HEXAGON POINTS/////////////////////////////
    /////////////////////////////////////////////////

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






  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
        playerName = document.getElementById('playerName').value;

    nameForm.style.display = 'none';
    canvas.style.display = 'block';

        hexagonGroup = document.getElementById('hexagonGroup');


    //drawHexagons(); // Llama a la función para dibujar hexágonos en el fondo

        createHexagons();

  });

  // Resto de tu código

});
