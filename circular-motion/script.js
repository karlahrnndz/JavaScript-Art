/*
Circular motion.
*/

// Initialiizing variables
var canvas = document.querySelector('canvas')
var c = canvas.getContext('2d')
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


// Objects
function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.update = () => {
      this.draw();
    };

    this.draw = () => {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0,
      Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.closePath();
    }
}

// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 1; i++) {
    particles.push(new Particle(canvas.width
    / 2, canvas.height / 2, 10, '#F29727'));
  }
}


// Animate Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
  });
}

init();
animate();
