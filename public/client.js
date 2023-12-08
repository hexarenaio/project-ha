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


    // Función para dibujar hexágonos en el fondo del canvas
  function drawHexagons() {
    // Definir propiedades de los hexágonos
    const hexSize = 50;
    const hexSpacing = 90;
    const yOffset = 100;

    // Dibujar hexágonos en filas y columnas
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const x = col * (hexSize + hexSpacing);
        const y = row * (hexSize * 1.75) + yOffset;

        // Dibujar hexágono
        drawHexagon(x, y, hexSize);
      }
    }
  }

  // Función para dibujar un hexágono en el canvas
  function drawHexagon(x, y, size) {
    context.beginPath();
    context.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    for (let i = 1; i <= 6; i++) {
      context.lineTo(
        x + size * Math.cos((i * 2 * Math.PI) / 6),
        y + size * Math.sin((i * 2 * Math.PI) / 6)
      );
    }

    context.fillStyle = '#fff2aa';
    context.fill();
    context.closePath();
    context.strokeStyle = '#ff9a00';
    context.stroke();
  }



  // Función para dibujar el texto con la cantidad de usuarios conectados
  function drawUserCount() {
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText(`Usuarios conectados: ${connectedUsers}`, 10, 40);
  }
});
