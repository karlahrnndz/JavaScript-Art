/*
Scare away starlings with your mouse/trackpad.
*/


// Initialiizing variables
var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');
var w = canv.width = window.innerWidth;
var h = canv.height = window.innerHeight;
var initRad = Math.min(w/2,h/2);
var scarea = Math.min(w/4,h/4);
var mousePos = null;
var noStarlings = 2000;
var starlingSize = 2.5;
var maxSpeed = 2;

// Defining a Starling
var Starling = function (id, scarea) {

  // Initialize the positions of the Starlings randomly within a circle
  // (positions closer to the center of the page are more common)
  var angle = Math.random()*2*Math.PI;
  var range = Math.pow(Math.random(),4)*initRad;
  
  this.x = Math.floor(Math.cos(angle)*range + w/2);
  this.y = Math.floor(Math.sin(angle)*range + h/2);

  // Defining the speed and direction of the heading of a Starling
  this.direction = Math.random()*Math.PI*2;
  this.baseSpeed = Math.random()*0.5 + .5;
  this.speed = this.baseSpeed;
  this.alpha = this.baseSpeed;
  this.color = '#262626';
  this.id = id;
  
  this.scareDist = 0.1*Math.random() + scarea;
  this.fearFactor = Math.random()*0.2 + 0.8;
  this.goalFactor = Math.random()*0.1 + 0.9;
  this.normalFactor = 0.1;
};


// Creating list of all Starlings
var Starlings = [];

for (i = 0; i < noStarlings; i++) {
  Starlings.push(new Starling(i, scarea));
};


// Generating new Starling positions
function update() {
  for (i = 0; i < Starlings.length; i++) {
    updateStarlingPosition(Starlings[i]);
  }
}


// Drawing all Starlings
function draw() {
  ctx.clearRect(0, 0, w, h);

  for (i = 0; i < Starlings.length; i++) {
    
    ctx.fillStyle = Starlings[i].color;
    ctx.globalAlpha = Starlings[i].alpha;

    // Drawing Starlings
    ctx.beginPath();
    ctx.arc(Starlings[i].x,
            Starlings[i].y,
            starlingSize,
            0,
            2*Math.PI, true);
    ctx.fill();
    ctx.closePath();
  }
}


// Function for updating Starling positions
function updateStarlingPosition(Starling){
  
  // Wrap a Starling's position if it goes off the edge
  if (Starling.x < 0){
    Starling.x += w;
  }
  else if (Starling.x > w){
    Starling.x -= w;
  }
  if (Starling.y < 0){
    Starling.y += h;
  }
  else if (Starling.y > h){
    Starling.y -= h;
  }
  
  var angle_to_center = Math.atan2(h/2 - Starling.y,
                                   w/2 - Starling.x);
  var distance_center = Math.sqrt(Math.pow(w/2 - Starling.x, 2) +
                                  Math.pow(h/2 - Starling.y, 2));  
  
  // If 'mousePos' exists and is not null
  if (mousePos!==null && typeof mousePos !== 'undefined') {

    var angle_away_mouse = Math.PI +
        Math.atan2(mousePos.y - Starling.y,
                   mousePos.x - Starling.x);
    var distance_mouse = 
        Math.sqrt(Math.pow(mousePos.y - Starling.y, 2) +
                  Math.pow(mousePos.x - Starling.x, 2));

    // If Starling within 'Starling.scareDist' of 'mousePos'
    if (distance_mouse <= Starling.scareDist) {
      
      Starling.direction = 
        Starling.direction*(1 - Starling.fearFactor) + 
        angle_away_mouse*(Starling.fearFactor);
      
      Starling.speed = 
        Starling.speed*(1 - Starling.fearFactor) +
        Starling.fearFactor*(maxSpeed*(1 -distance_mouse/Starling.scareDist) + 
        Starling.baseSpeed*(distance_mouse/Starling.scareDist));
      
      // If Starling not within 'Starling.scareDist'  from 'mousePos'
    }  else if (distance_center > initRad &&
                distance_mouse >= Starling.scareDist*(1 + 0.5)) {
    
        Starling.direction = Starling.direction*(1 - Starling.goalFactor) +
          angle_to_center*(Starling.goalFactor);
        
        Starling.speed = Starling.speed*(1 - Starling.goalFactor) +
        Starling.goalFactor*(maxSpeed*(1 - initRad/distance_center) +
                              Starling.baseSpeed*(initRad/distance_center));
    }
    
    // If 'mousePos' does not exist or is null
  } else {
    
    // If Starling far from center of page
    if (distance_center > initRad){
        Starling.direction = Starling.direction*(1 - Starling.goalFactor) +
          angle_to_center*(Starling.goalFactor);
        
        Starling.speed = Starling.speed*(1 - Starling.goalFactor) +
        Starling.goalFactor*(maxSpeed*(1 - initRad/distance_center) +
                              Starling.baseSpeed*(initRad/distance_center));
      } else {
        
        Starling.speed = Starling.speed*(1 - Starling.normalFactor) +
          Starling.baseSpeed*(Starling.normalFactor);
      }
  }
  
  // Updating Starling's heading (direction)
  var addX = Math.cos(Starling.direction) * Starling.speed; 
  var addY = Math.sin(Starling.direction) * Starling.speed;

  Starling.x = Starling.x + addX;
  Starling.y = Starling.y + addY;
}

// Auxiliary functions

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
};

window.addEventListener('resize', function() {
  canv.width = w = window.innerWidth;
  canv.height = h = window.innerHeight;
}, false);

canv.addEventListener('mousemove', function(evt) {
  mousePos = getMousePos(canv, evt);
}, false);

canv.addEventListener('mouseout', function(evt) {
  mousePos = null;
}, false);

canv.addEventListener('mouseleave', function(evt) {
  mousePos = null;
}, false);

function run() {
  window.requestAnimationFrame(run);
  update();
  draw();
}

run();
