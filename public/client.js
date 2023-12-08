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

  // ...

  // Resto del código (manejo de círculos y usuarios conectados)

  // ...

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

  // Resto del código (manejo de círculos y usuarios conectados)

  // ...
});
