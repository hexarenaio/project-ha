const socket = io();

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('click', (event) => {
  const x = event.clientX;
  const y = event.clientY;

  const circle = {
    x,
    y,
    radius: 10, // Ajusta según tus necesidades
    color: 'red', // Ajusta según tus necesidades
  };

  socket.emit('circle', circle);
});

socket.on('circle', (data) => {
  drawCircle(data);
});

function drawCircle(data) {
  ctx.beginPath();
  ctx.arc(data.x, data.y, data.radius, 0, 2 * Math.PI);
  ctx.fillStyle = data.color;
  ctx.fill();
  ctx.closePath();
}
