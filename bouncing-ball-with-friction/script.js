/*
A simple bouncing ball with friction.
*/

// Initialiizing variables
var canvas = document.querySelector('canvas')
var c = canvas.getContext('2d')
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var gravity = 1;
var friction = 0.95;
var ballColor = '#F7C45F';
var ballRadius = 30;
var initVelocity = 2;
var floorHeight = 0.9;
var floorCenter = canvas.width/2;
var floorThickness = 5;
var floorWidth = 100;

// Objects
function Floor(x, y, width, thickness) {

  this.x = x;
  this.y = y;
  this.width = width;
  this.alpha = 1;

  this.draw = function() {
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.moveTo(this.x - this.width/2, this.y);
    c.lineTo(this.x + this.width/2, this.y);
    c.strokeStyle = "#F7C45F";
    c.lineWidth = thickness;
    c.lineCap = 'round';
    c.stroke();
    c.closePath();
  }
}


function Ball(x, y, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dy = dy;
  this.radius = radius
  this.color = color

  this.update = function(friction, gravity, floorHeight) {
    if (this.y + this.radius + this.dy >= canvas.height*floorHeight) {
      this.dy = -this.dy * friction;
      this.y = canvas.height*floorHeight - this.radius;
    } else {
      this.dy += gravity;
      this.y += this.dy;
    }
    this.draw();
  };

  this.draw = function() {
    c.globalAlpha = 1;
    c.beginPath();
    c.arc(this.x,
          this.y,
          this.radius,
          0,
          Math.PI*2,
          false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };
}


// Implementation
var ball
var  floor
function init() {
  ball = new Ball(canvas.width*0.5,
                  canvas.height*0.3,
                  gravity,
                  ballRadius,
                  ballColor);

  floor = new Floor(canvas.width*0.5,
                    canvas.height*0.9,
                    floorWidth,
                    floorThickness);

}



// Animation loop
function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);
  ball.update(friction, gravity, floorHeight);
  floor.draw();
}

init();
animate();


// Event listeners
addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});
