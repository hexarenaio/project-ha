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

        drawHexGrid();

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
  // Función para dibujar la malla de hexágonos
  function drawHexGrid() {
    const hexRadius = 20;
    const hexWidth = Math.sqrt(3) * hexRadius;
    const hexHeight = 2 * hexRadius;
    const cols = Math.floor(canvas.width / hexWidth) + 1;
    const rows = Math.floor(canvas.height / hexHeight) + 1;

    context.strokeStyle = 'black';

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const x = col * hexWidth * 3 / 4;
        const y = row * hexHeight;

        drawHexagon(x, y, hexRadius);
      }
    }
  }

  // Función para dibujar un hexágono en una posición dada
  function drawHexagon(x, y, radius) {
    context.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const offsetX = radius * Math.cos(angle);
      const offsetY = radius * Math.sin(angle);
      context.lineTo(x + offsetX, y + offsetY);
    }
    context.closePath();
    context.stroke();
  }

 

  // Función para dibujar el texto con la cantidad de usuarios conectados
  function drawUserCount() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Usuarios conectados: ${connectedUsers}`, 10, 40);
  }
});
