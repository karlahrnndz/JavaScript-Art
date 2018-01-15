/*
Move the mouse around the canvas to blow away the cherry blossoms.

Take your mouse off of the canvas to cause the blossoms to return to a random (somewhat centered) position.
*/


var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');
var w = canv.width = window.innerWidth;
var h = canv.height = window.innerHeight;
var scarea = Math.min(w/4,h/4,400);


// Defining Blossom size, possible colors, and color frequencies
var light_coral = '#F08080';
var salmon = '#FA8072';
var light_salmon = '#FFA07A';
var berry = '#8f0d3f';
var col_list = [light_coral, salmon, light_salmon, berry];
var col_freqs = [5, 5, 2, 2]; // Change to make different colors more frequent
var col_freqs_cumsum = [];
col_freqs.reduce(function(a,b,i) { return col_freqs_cumsum[i] = a+b; },0);
var blossom_size = 4;
var petal_size = 3;
var no_of_blossoms = 1000; // Number of Blossoms


// Defining a Blossom
var Blossom = function () {
  
  // Initialize the positions of the Blossoms randomly within a circle of radius 'scarea'
  var angle = Math.random() * 2 * Math.PI;
  var range = Math.sqrt(Math.random()) * scarea;
  this.x = Math.floor(Math.cos(angle) * range + w/2);
  this.y = Math.floor(Math.sin(angle) * range + h/2);
    
  // Define petal locations relative to center of Blossom
  var v1 = [ 0, blossom_size * Math.sin(Math.PI/2)]; // Top
  var v2 = [blossom_size * Math.cos((Math.PI/2) + (2 * Math.PI/5)), blossom_size * Math.sin((Math.PI/2) + (2 * Math.PI/5))]; // Top left
  var v3 = [blossom_size * Math.cos((Math.PI/2) - (2 * Math.PI/5)), blossom_size * Math.sin((Math.PI/2) - (2 * Math.PI/5))]; // Top right
  var v4 = [blossom_size * Math.cos((Math.PI/2) + (4 * Math.PI/5)), blossom_size * Math.sin((Math.PI/2) + (4 * Math.PI/5))]; // Bottom left
  var v5 = [blossom_size * Math.cos((Math.PI/2) - (4 * Math.PI/5)), blossom_size * Math.sin((Math.PI/2) - (4 * Math.PI/5))]; // Bottom right 
  this.vertices = [v1, v2, v3, v4, v5];
  
  // Randomly assign a color to a Blossom
  var sel = Math.floor(Math.random()*col_freqs_cumsum[col_freqs_cumsum.length-1]);
  var count = 0;
  for(var i = 0; i < col_list.length; ++i){
    if(col_freqs_cumsum[i] < sel)
        count++;
  }
  this.color = col_list[count];

  // Defining the speed and direction of the rotation of a Blossom
  this.rotation = Math.random() * 0.05; // Speed
  this.clockwise = Math.random() < 0.5; // Boolean for direction
  
  // Defining the speed and direction of the heading of a Blossom
  this.direction = Math.random() * Math.PI * 2;
  this.speed = Math.random()*0.5+0.1;
};


// Creating list of Blossoms
var Blossoms = [];
for (i = 0; i < no_of_blossoms; i++) {
  Blossoms.push(new Blossom());
}


// Rotating Blossoms and generating new Blossom positions
function update() { 
  for (i = 0; i < Blossoms.length; i++) { 
    rotateBlossom(Blossoms[i]);
    updateBlossomPosition(Blossoms[i]);
  }
}


// Drawing all Blossoms
function draw() {
  ctx.fillStyle = '#eeeeee'; // Background color
  ctx.globalAlpha = 0; // Set equal to 1 to hide text on page
  ctx.clearRect(0, 0, w, h);
  ctx.fillRect(0, 0, w, h);
  
  for (i = 0; i < Blossoms.length; i++) { 
    ctx.fillStyle = Blossoms[i].color;
    ctx.globalAlpha = 1;

    // Drawing Blossoms
    ctx.beginPath();
    ctx.arc(Blossoms[i].x + Blossoms[i].vertices[0][0], Blossoms[i].y + Blossoms[i].vertices[0][1], petal_size, 0, 2*Math.PI, true);
    ctx.fill(); // Petal 1

    ctx.beginPath();
    ctx.arc(Blossoms[i].x + Blossoms[i].vertices[1][0], Blossoms[i].y + Blossoms[i].vertices[1][1], petal_size, 0, 2*Math.PI, true);
    ctx.fill(); // Petal 2

    ctx.beginPath();
    ctx.arc(Blossoms[i].x + Blossoms[i].vertices[2][0], Blossoms[i].y + Blossoms[i].vertices[2][1], petal_size, 0, 2*Math.PI, true);
    ctx.fill(); // Petal 3

    ctx.beginPath();
    ctx.arc(Blossoms[i].x + Blossoms[i].vertices[3][0], Blossoms[i].y + Blossoms[i].vertices[3][1], petal_size, 0, 2*Math.PI, true);
    ctx.fill(); // Petal 4

    ctx.beginPath();
    ctx.arc(Blossoms[i].x + Blossoms[i].vertices[4][0], Blossoms[i].y + Blossoms[i].vertices[4][1], petal_size, 0, 2*Math.PI, true);
    ctx.fill(); // Petal 5

    // And now the center of the Blossom
    ctx.fillStyle = '#eeeeee';
    ctx.beginPath();
    ctx.arc(Blossoms[i].x, Blossoms[i].y, petal_size/2, 0, 2*Math.PI, true);
    ctx.fill(); // Center of Blossom

  }
}


// Function for updating Blossom positions
function updateBlossomPosition(Blossom){
  var speedMult = 2;

  // Wrap a Blossom's position if it goes off the edge of the screen
  if (Blossom.x < 0){
    Blossom.x += w;
  }
  else if (Blossom.x > w){
    Blossom.x -= w;
  }
  if (Blossom.y < 0){
    Blossom.y += h;
  }
  else if (Blossom.y > h){
    Blossom.y -= h;
  }

  try{
    // If 'mousePos' exists, change the intended heading of the Blossom to face away from 'mousePos'
    var angleRad = Math.PI + Math.atan2(mousePos.y - Blossom.y, mousePos.x - Blossom.x);
    var radius = Math.sqrt(Math.pow(mousePos.y - Blossom.y,2) + Math.pow(mousePos.x - Blossom.x,2));
    
    if (radius < scarea){
    Blossom.direction = Math.atan2( (Math.sin(Blossom.direction) * 20 + Math.sin(angleRad) ),
                                    (Math.cos(Blossom.direction) * 20 + Math.cos(angleRad) ));
    speedMult = 20-18*radius/scarea;
    }
  }

  catch(err) {
  	// If 'mousePos' does not exist, change the intended heading of the Blossom 
  	// to be random within a centered circle of radius 'scarea'
  	var angleRad = Math.atan2(h/2- Blossom.y, w/2- Blossom.x);
  	var offset = Math.sqrt(Math.pow(w/2-Blossom.x,2) + Math.pow(h/2-Blossom.y,2));

  	if (offset > scarea ){
    Blossom.direction = Math.atan2( (Math.sin(Blossom.direction) * 20 + Math.sin(angleRad) ),
                                    (Math.cos(Blossom.direction) * 20 + Math.cos(angleRad) ));
    speedMult = 2;
    }

  } 
  
  // Updating Blossom's heading (direction)
  var addX = Math.cos(Blossom.direction) * Blossom.speed * speedMult; 
  var addY = Math.sin(Blossom.direction) * Blossom.speed * speedMult;

  Blossom.x = Blossom.x + addX;
  Blossom.y = Blossom.y + addY;

}


// Auxiliary functions:

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function rotateBlossom(Blossom){
  Blossom.vertices[0] = rotatePoint(Blossom.vertices[0], Blossom.rotation, Blossom.clockwise);
  Blossom.vertices[1] = rotatePoint(Blossom.vertices[1], Blossom.rotation, Blossom.clockwise);
  Blossom.vertices[2] = rotatePoint(Blossom.vertices[2], Blossom.rotation, Blossom.clockwise);
  Blossom.vertices[3] = rotatePoint(Blossom.vertices[3], Blossom.rotation, Blossom.clockwise);
  Blossom.vertices[4] = rotatePoint(Blossom.vertices[4], Blossom.rotation, Blossom.clockwise);
}

function rotatePoint(vertex, rotation, clockwise){
  var s = Math.sin(rotation);
  var c = Math.cos(rotation);
  
  if(clockwise){
    var newx = vertex[0] * c - vertex[1] * s;
    var newy = vertex[0] * s + vertex[1] * c;
  }
  else{
    var newx = vertex[0] * c + vertex[1] * s;
    var newy = - vertex[0] * s + vertex[1] * c;
  }
  return [newx,newy];
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
