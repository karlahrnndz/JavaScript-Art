/*
Move your mouse to have the particles follow.
*/


// Initialiizing variables
var canvas = document.querySelector('canvas')
var c = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouse = {x: canvas.width / 2, y: canvas.height / 2}

// Event listeners
addEventListener('mousemove', event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
})

// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Objects
function Particle(radius, color) {
    this.radius = radius;
    this.color = color;
    this.velocity = 0.02;
    this.radians = Math.random() * Math.PI * 2;
    this.distanceFromCenter = randomIntFromRange(50, 200);

    this.x = mouse.x + Math.cos(this.radians) * this.distanceFromCenter;
    this.y = mouse.y + Math.sin(this.radians) * this.distanceFromCenter;
    this.lastMouse = {x: mouse.x, y: mouse.y};

    this.update = () => {
      const lastPoint = {x: this.x, y: this.y};
      // Move points over time
      this.radians += this.velocity;

      // Drag Effect
      this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
      this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

      // Circular Motion
      this.x = this.lastMouse.x + Math.cos(this.radians) *
      this.distanceFromCenter;
      this.y = this.lastMouse.y + Math.sin(this.radians) *
      this.distanceFromCenter;
      this.draw(lastPoint);
    };

    this.draw = lastPoint => {
      c.beginPath();
      c.lineCap = "round";
      c.strokeStyle = this.color;
      c.lineWidth = this.radius;
      c.moveTo(lastPoint.x, lastPoint.y);
      c.lineTo(this.x, this.y);
      c.stroke();
      c.closePath();
    }
}


// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 50; i++) {
    const radius = Math.random() * 5 + 5;
    particles.push(new Particle(radius, '#F29727'));
  }
}


// Animate Loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'rgba(35, 35, 35, 0.5)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
  });
}

init();
animate();
