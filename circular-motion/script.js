/*
Circular motion.
*/


// Initialiizing variables
var canvas = document.querySelector('canvas')
var c = canvas.getContext('2d')
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Objects
function Particle(radius, color) {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    this.radius = radius;
    this.color = color;
    this.velocity = 0.05;
    this.radians = Math.random() * Math.PI * 2;
    this.distanceFromCenter = randomIntFromRange(50, 200);
    this.x = x + Math.cos(this.radians) *
    this.distanceFromCenter;
    this.y = y + Math.sin(this.radians) *
    this.distanceFromCenter;

    this.update = () => {
      const lastPoint = {x: this.x, y: this.y}
      ;
      // Move points over time
      this.radians += this.velocity;
      this.x = x + Math.cos(this.radians) *
      this.distanceFromCenter;
      this.y = y + Math.sin(this.radians) *
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
