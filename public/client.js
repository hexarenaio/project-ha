document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  let playerName;
  let playerPosition = { x: 0, y: 0 };
  let hexRadius = 30;

  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    playerName = document.getElementById('playerName').value;
    nameForm.style.display = 'none';
    canvas.style.display = 'block';
  });

  canvas.addEventListener('click', function (event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Actualizar la posición del jugador al hacer clic
    playerPosition = getHexagonAt(mouseX, mouseY);

    // Enviar la información del jugador al servidor
    socket.emit('playerMove', { playerName, position: playerPosition });
  });

  socket.on('updatePlayers', function (players) {
    // Limpiar el canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la malla de hexágonos
    drawHexagonGrid();

    // Dibujar a todos los jugadores
    for (const player of players) {
      drawPlayer(player.position.x, player.position.y);
    }
  });

  // Función para dibujar la malla de hexágonos
  function drawHexagonGrid() {
    const cols = Math.floor(canvas.width / (hexRadius * 3));
    const rows = Math.floor(canvas.height / (hexRadius * Math.sqrt(3)));

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const x = col * hexRadius * 3 + (row % 2 === 1 ? hexRadius * 1.5 : 0);
        const y = row * hexRadius * Math.sqrt(3);
        drawHexagon(x, y);
      }
    }
  }

  // Función para dibujar un hexágono en una posición dada
  function drawHexagon(x, y) {
    context.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const offsetX = hexRadius * Math.cos(angle);
      const offsetY = hexRadius * Math.sin(angle);
      context.lineTo(x + offsetX, y + offsetY);
    }
    context.closePath();
    context.stroke();
  }

  // Función para obtener la posición del hexágono en las coordenadas dadas
  function getHexagonAt(mouseX, mouseY) {
    const cols = Math.floor(canvas.width / (hexRadius * 3));
    const rows = Math.floor(canvas.height / (hexRadius * Math.sqrt(3)));

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const x = col * hexRadius * 3 + (row % 2 === 1 ? hexRadius * 1.5 : 0);
        const y = row * hexRadius * Math.sqrt(3);

        // Verificar si el punto está dentro del hexágono
        if (isPointInHexagon(mouseX, mouseY, x, y)) {
          return { x, y };
        }
      }
    }

    return { x: 0, y: 0 }; // Devolver una posición por defecto si no se encuentra un hexágono
  }

  // Función para verificar si un punto está dentro de un hexágono
  function isPointInHexagon(pointX, pointY, hexX, hexY) {
    const offsetX = pointX - hexX;
    const offsetY = pointY - hexY;
    const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);

    return distance < hexRadius;
  }

  // Función para dibujar a un jugador
  function drawPlayer(x, y) {
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();
    context.stroke();

    // Mostrar el nombre del jugador encima del círculo
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.fillText(playerName, x - 20, y - 15);
  }
});
