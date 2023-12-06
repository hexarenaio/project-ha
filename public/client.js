document.addEventListener('DOMContentLoaded', function () {
  const socket = io();
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const nameForm = document.getElementById('nameForm');

  // Capturar el nombre del jugador
  let playerName;

  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    playerName = document.getElementById('playerName').value;
    nameForm.style.display = 'none';
    canvas.style.display = 'block';
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

  // Función para dibujar un círculo en el canvas con el nombre del jugador
  function drawCircle(x, y, playerName) {
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();

    // Mostrar el nombre del jugador encima del círculo
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.fillText(playerName, x - 20, y - 15);
  }
});
