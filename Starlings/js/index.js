/*
Starlings.
*/


var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');
var w = canv.width = window.innerWidth;
var h = canv.height = window.innerHeight;
var init_rad = Math.min(w/10,h/10,150);
var scarea = Math.min(w/4,h/4,400);
var no_buddies = Math.min(300, no_of_Starlings);


// Defining number of Starlings, Starling size, and Starling color
var no_of_Starlings = 1000; // Number of Starlings
var starling_size = 2.5; // Starling size
var starling_color = '#262626'; // Starling color

// Defining a Starling
var Starling = function () {
  
  // Initialize the positions of the Starlings randomly within a circle
  // (positions closer to the center of the page are more common)
  var angle = Math.random() * 2 * Math.PI;
  var range = Math.pow(Math.random(),4) * init_rad;
  this.x = Math.floor(Math.cos(angle) * range + w/2);
  this.y = Math.floor(Math.sin(angle) * range + h/2);

  // Defining the speed and direction of the heading of a Starling
  this.direction = Math.random() * Math.PI * 2;
  this.speed = Math.random()*0.5+0.1;
};

// Creating list of Starlings
var Starlings = [];
for (i = 0; i < no_of_Starlings; i++) {
  Starlings.push(new Starling());
}

// Generating new Starling positions
function update() { 
  for (i = 0; i < Starlings.length; i++) { 
    updateStarlingPosition(Starlings[i]);
  }
}

// Drawing all Starlings
function draw() {
  ctx.globalAlpha = 0;
  ctx.clearRect(0, 0, w, h);
  ctx.fillRect(0, 0, w, h);
  
  for (i = 0; i < Starlings.length; i++) { 
    ctx.fillStyle = starling_color;
    ctx.globalAlpha = 1;

    // Drawing Starlings
    ctx.beginPath();
    ctx.arc(Starlings[i].x, Starlings[i].y, starling_size, 0, 2*Math.PI, true);
    ctx.fill();
  }
}


// Function for updating Starling positions
function updateStarlingPosition(Starling){
  var speedMult = 2;

  // Wrap a Starling's position if it goes off the edge of the screen
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


// If 'mousePos' exists
  try {

    var angle_away_mouse = Math.PI + Math.atan2(mousePos.y - Starling.y, mousePos.x - Starling.x);
    var distance_mouse = Math.sqrt(Math.pow(mousePos.y - Starling.y,2) + Math.pow(mousePos.x - Starling.x,2));

    // If Starling within 'scarea' of 'mousePos'  
    if (distance_mouse < scarea){
    Starling.direction = Math.atan2( (Math.sin(Starling.direction) * 20 + Math.sin(angle_away_mouse) ),
                                    (Math.cos(Starling.direction) * 20 + Math.cos(angle_away_mouse) ));
    speedMult = 20-18*distance_mouse/scarea;

    // If Starling not within 'scarea'  from 'mousePos'
    } 
    
    else {
    var angle_to_center = Math.atan2(h/2- Starling.y, w/2- Starling.x);
    var distance_center = Math.sqrt(Math.pow(w/2-Starling.x,2) + Math.pow(h/2-Starling.y,2));
	    if (distance_center > init_rad ){
	    Starling.direction = Math.atan2( (Math.sin(Starling.direction) * 20 + Math.sin(angle_to_center) ),
	                                    (Math.cos(Starling.direction) * 20 + Math.cos(angle_to_center) ));
	    speedMult = 2;
		}
	}
  }

 // If 'mousePos' does not exist
  catch(err) {
  	var angle_to_center = Math.atan2(h/2- Starling.y, w/2- Starling.x);
  	var distance_center = Math.sqrt(Math.pow(w/2-Starling.x,2) + Math.pow(h/2-Starling.y,2));

  	// If Starling far from center of page
  	if (distance_center > init_rad * 2 ){
    Starling.direction = Math.atan2( (Math.sin(Starling.direction) * 20 + Math.sin(angle_to_center) ),
                                    (Math.cos(Starling.direction) * 20 + Math.cos(angle_to_center) ));
    speedMult = 2;
    }

  } 
  
  // Updating Starling's heading (direction)
  var addX = Math.cos(Starling.direction) * Starling.speed * speedMult; 
  var addY = Math.sin(Starling.direction) * Starling.speed * speedMult;

  Starling.x = Starling.x + addX;
  Starling.y = Starling.y + addY;

}


// Auxiliary functions:

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

window.addEventListener('resize', function() {
  canv.width = w = window.innerWidth;
  canv.height = h = window.innerHeight;
}, false);

canv.addEventListener('mousemove', function(evt) {
  mousePos = getMousePos(canv, evt);
}, false);

canv.addEventListener('mouseout', function(evt) {
  mousePos = null;
  speedMult = 2;
}, false);

function run() {
  window.requestAnimationFrame(run);
  update();
  draw();
}

run();

