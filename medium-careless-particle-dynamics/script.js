/*
Can you explain why particles create the "pac-man" effect you see?
*/


// Initialiizing variables
var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');
var w = canv.width = window.innerWidth;
var h = canv.height = window.innerHeight;
var initRad = Math.min(w/2,h/2);
var scarea = Math.min(w/3,h/3);
var noParticles = 500;
var particleSize = 2.5;


// Defining a Particle
var Particle = function (id, initRad) {

  // Initialize the positions of the Particles randomly
  // according to a uniform distribution on the circle
  var angle = Math.random()*2*Math.PI;
  var range = Math.pow(Math.random(),0.5)*initRad;

  this.x = Math.floor(Math.cos(angle)*range + w/2);
  this.y = Math.floor(Math.sin(angle)*range + h/2);

  // Defining random heading of a particle
  this.direction = Math.random()*Math.PI*2;

  // Defining deterministic properties of a particle
  this.speed = 2;
  this.alpha = 1;
  this.goalFactor = 0.9;
  this.id = id;
  this.color = '#80A68D';
};


// Creating list of all Particles
var Particles = [];

for (i = 0; i < noParticles; i++) {
  Particles.push(new Particle(i, initRad));
};


// Generating new Particle positions
function update() {
  for (i = 0; i < Particles.length; i++) {
    updateParticlePosition(Particles[i]);
  };
};

// Drawing all Particles
function draw() {
  ctx.clearRect(0, 0, w, h);

  for (i = 0; i < Particles.length; i++) {

    ctx.fillStyle = Particles[i].color;
    ctx.globalAlpha = Particles[i].alpha;

    // Drawing Particles
    ctx.beginPath();
    ctx.arc(Particles[i].x,
            Particles[i].y,
            particleSize,
            0,
            2*Math.PI, true);
    ctx.fill();
    ctx.closePath();
  };
};


// Function for updating Particle positions
function updateParticlePosition(Particle){

  var angle_to_center = Math.atan2(h/2 - Particle.y,
                                   w/2 - Particle.x);
  var distance_center = Math.sqrt(Math.pow(w/2 - Particle.x, 2) +
                                  Math.pow(h/2 - Particle.y, 2));

  // If Particle far from center of page
  if (distance_center > scarea){

      Particle.direction = Particle.direction * (1 - Particle.goalFactor) +
        angle_to_center * (Particle.goalFactor);
    };

  // Updating Particle's position
  var addX = Math.cos(Particle.direction) * Particle.speed;
  var addY = Math.sin(Particle.direction) * Particle.speed;

  Particle.x = Particle.x + addX;
  Particle.y = Particle.y + addY;
};


// Auxiliary functions

window.addEventListener('resize', function() {
  canv.width = w = window.innerWidth;
  canv.height = h = window.innerHeight;
}, false);

function run() {
  window.requestAnimationFrame(run);
  update();
  draw();

  ctx.strokeStyle = "#80A68D";
  ctx.setLineDash([5, 3])
  ctx.beginPath();
  ctx.arc(w/2,
          h/2,
          scarea,
          0,
          2*Math.PI, true);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(w/2,
          h/2,
          initRad,
          0,
          2*Math.PI, true);
  ctx.stroke();
  ctx.closePath();
};

run();
