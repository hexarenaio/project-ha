document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let connectedUsers = 0;

  let circleX = (hexRectangleHeight / 2) - 2;
  let circleY = hexRectangleHeight;




  const hexagonAngle = 0.523598776; // 30 degrees in radians

//  const hexagonAngle = (2 * Math.PI) / 3; // Ángulo de 120 grados en radianes

  const sideLength = 38;
  let hexHeight, hexRadius, hexRectangleHeight, hexRectangleWidth;



    //  const bluePoint = document.getElementById('bluePoint');

 //     document.addEventListener('click', moveBluePoint);


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

    function moveBluePoint(event) {
      const clickX = event.clientX;
      const clickY = event.clientY;

      // Encuentra la línea de trayectoria más cercana al punto azul
      const closestLine = findClosestLine(clickX, clickY);

      if (closestLine) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', closestLine.x1);
        line.setAttribute('y1', closestLine.y1);
        line.setAttribute('x2', closestLine.x2);
        line.setAttribute('y2', closestLine.y2);
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', '2');

        trajectoryLines.appendChild(line);

        bluePoint.setAttribute('cx', closestLine.x2);
        bluePoint.setAttribute('cy', closestLine.y2);
      }
    }

    function findClosestLine(x, y) {
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




   // document.addEventListener('click', moveBluePoint);


  

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
 //   drawCircle((hexRectangleHeight / 2)-2, hexRectangleHeight, 4, "red", playerName);
    drawCircle(circleX, circleY, 4, "red", playerName);

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



  function updateCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawHexagons();
  }

  // Agregar un event listener para clics en el canvas
 

  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    playerName = document.getElementById('playerName').value;
    nameForm.style.display = 'none';
    canvas.style.display = 'block';

    drawHexagons(); // Llama a la función para dibujar hexágonos en el fondo
  });

  // Resto de tu código

});

