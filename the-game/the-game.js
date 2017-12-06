// the-game.js
// https://stackoverflow.com/questions/27533331/problems-making-enemy-follow-moving-player
// possible solution to making the villain chase the hero?
var gl;
var canvas;
const WALLHEIGHT = 70.0; // Some playing field parameters
const ARENASIZE = 1000.0;
const EYEHEIGHT = 15.0;
const HERO_VP = 0.625;

const  upx=0.0, upy=1.0, upz=0.0;    // Some LookAt params

const fov = 60.0;     // Perspective view params
const near = 1.0;
const far = 10000.0;
var aspect, eyex, eyez;

var width;      // canvas size
var height;
var vp1_left = 0;      // Left viewport -- the hero's view
var vp1_bottom = 0;

// Lighting stuff
var la0 = [ 0.2, 0.2, 0.2, 1.0 ]; // light 0 ambient intensity
var ld0 = [ 1.0, 1.0, 1.0, 1.0 ]; // light 0 diffuse intensity
var ls0 = [ 1.0, 1.0, 1.0, 1.0 ]; // light 0 specular
var lp0 = [ 0.0, 1.0, 1.0, 1.0 ]; // light 0 position -- will adjust to hero's viewpoint
var ma = [ 0.2, 0.02, 0.02, 1.0 ]; // material ambient
var md = [ 0.6, 0.08, 0.08, 1.0 ]; // material diffuse
var ms = [ 0.7, 0.6, 0.6, 1.0 ]; // material specular
var me = 75;             // shininess exponent
const red  = [ 1.0, 0.0, 0.0, 1.0 ]; // pure red
const blue = [ 0.0, 0.0, 1.0, 1.0 ]; // pure blue
const green = [ 0.0, 1.0, 0.0, 1.0 ]; // pure green
const yellow = [ 1.0, 1.0, 0.0, 1.0 ]; // pure yellow
const gray = [0.5, 0.5, 0.5, 1.0]; // gray

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var program;

var arena;
var hero;
var thingSeeking;
var villain;
var thwomp;
var thwomp2;
var count = 0;

var g_matrixStack = []; // Stack for storing a matrix

window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );
    fit();
    timer();

    // gl = WebGLUtils.setupWebGL( canvas );
    gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
    if ( !gl ) {
        alert( "WebGL isn't available" );
    }

    //  Configure WebGL

    gl.clearColor( 0.2, 0.8, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    eyex = 3 * ARENASIZE / 4.0;	// Where the hero starts
    eyez = -ARENASIZE;
    aspect = width / height;

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"), 0); // Assume no texturing is the default used in
                     // shader.  If your game object uses it, be sure
                     // to switch it back to 0 for consistency with
                     // those objects that use the default.


    arena = new Arena(program);
    arena.init();

    hero = new Hero(program, eyex, 0.0, eyez, 45, 10.0);
    hero.init();

    thingSeeking = new ThingSeeking(program, ARENASIZE / 4.0, 0.0, -ARENASIZE / 4.0, 0, 10.0);
    thingSeeking.init();

    villain = new Villain(program, 3 * ARENASIZE / 4.0, 0.0, -ARENASIZE / 4.0, 0, 20.0);
    villain.init();

    thwomp = new Thwomp(program, ARENASIZE / 3.0, 0.0, -ARENASIZE / 6.0, 0, 20.0);
    thwomp.init();

    thwomp2 = new Thwomp(program, ARENASIZE / 5.0, 0.0, -ARENASIZE / 3.0, 0, 20.0);
    thwomp2.init();

    render();
};

function render()
{
    whatKey();
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Hero's eye viewport
    gl.viewport( vp1_left, vp1_bottom, width, height );

    lp0[0] = hero.x + hero.xdir; // Light in front of hero, in line with hero's direction
    lp0[1] = EYEHEIGHT;
    lp0[2] = hero.z + hero.zdir;
    modelViewMatrix = lookAt( vec3(hero.x, EYEHEIGHT, hero.z),
                      vec3(hero.x + hero.xdir, EYEHEIGHT, hero.z + hero.zdir),
                      vec3(upx, upy, upz) );
    projectionMatrix = perspective( fov, HERO_VP * aspect, near, far );
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    arena.show();
    hero.show();
    if(parseInt(document.getElementById("minutes").innerHTML) > 0 || parseInt(document.getElementById("seconds").innerHTML) > 19){
      thingSeeking.show();
    }
    villain.show();
    thwomp.show();
    thwomp2.show();

    // Overhead viewport
    var horiz_offset = width * (1.0 - HERO_VP) / 20.0;
    gl.viewport(vp1_left + .75 * width, vp1_bottom + .75 * height, width * .248, height * .248);
    modelViewMatrix = lookAt(vec3(500.0, 100.0, -500.0), vec3(500.0, 0.0, -500.0), vec3(0.0, 0.0, -1.0));
    projectionMatrix = ortho(-500, 500, -500, 500, 0, 200);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    arena.show();
    hero.show();
    if(parseInt(document.getElementById("minutes").innerHTML) > 0 || parseInt(document.getElementById("seconds").innerHTML) > 19){
      thingSeeking.show();
    }
    villain.show();
    thwomp.show();
    thwomp2.show();

    villain.updateAngle(hero);
    villain.turn(villain.degrees);
    villain.updateSpeed(3);
    villain.move(villain.speedX + villain.speedZ);
    
    if (count === 30) {
      thwomp.turn(90);
      thwomp2.turn(90);
      count = 0;
    } else {
      thwomp.move(-5);
      thwomp2.move(5);
      count++;
    }
    if (collision()<0) {
      location.href = "./the-end.html";
    }
    else{
      requestAnimFrame( render );
    }
}

function timer(){
  var minutes = 0;
  var seconds = 0;
  var appendSeconds = document.getElementById("seconds");
  var appendMinutes = document.getElementById("minutes");
  var Interval;

  Interval = setInterval(startTimer, 1000);

  function startTimer () {
    seconds++;

    if (seconds < 10) {
      appendSeconds.innerHTML = "0" + seconds;
    }
    if(seconds > 9) {
      appendSeconds.innerHTML = seconds;
    }
    if(seconds > 59){
      minutes++;
      appendMinutes.innerHTML = "0" + minutes;
      seconds = 0;
      appendSeconds.innerHTML = "0" + 0;
    }
    if (minutes > 9){
      appendMinutes.innerHTML = minutes;
    }
  }

}

function fit(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function collision(){
  // collision will happen between two objects if the distances
  // between the between the two is less then the total bounding_cir_rad of both.
  var distanceXHeroVillain = hero.x - villain.x;
  var distanceZHeroVillain = hero.z - villain.z;
  var distanceXHeroThwomp = hero.x - thwomp.x;
  var distanceZHeroThwomp = hero.z - thwomp.z;
  var distanceXHeroThwomp2 = hero.x - thwomp2.x;
  var distanceZHeroThwomp2 = hero.z - thwomp2.z;

  var distanceXHeroSeek = hero.x - thingSeeking.x;
  var distanceZHeroSeek = hero.z - thingSeeking.z;

  var totalDistanceHeroVillain = Math.sqrt(distanceXHeroVillain*distanceXHeroVillain
    + distanceZHeroVillain*distanceZHeroVillain);

  var totalDistanceHeroSeeking = Math.sqrt(distanceXHeroSeek*distanceXHeroSeek
    + distanceZHeroSeek*distanceZHeroSeek);

  var totalDistanceHeroThwomp = Math.sqrt(distanceXHeroThwomp*distanceXHeroThwomp
    + distanceZHeroThwomp*distanceZHeroThwomp);

    var totalDistanceHeroThwomp2 = Math.sqrt(distanceXHeroThwomp2*distanceXHeroThwomp2
    + distanceZHeroThwomp2*distanceZHeroThwomp2);

  if(totalDistanceHeroVillain <= hero.bounding_cir_rad + villain.bounding_cir_rad
    || totalDistanceHeroThwomp <= hero.bounding_cir_rad + thwomp.bounding_cir_rad
    || totalDistanceHeroThwomp2 <= hero.bounding_cir_rad + thwomp2.bounding_cir_rad){
    return -1;
  }
  else if(totalDistanceHeroSeeking <= hero.bounding_cir_rad + thingSeeking.bounding_cir_rad){
    return 1;
  }
  if(hero.x<0 || hero.x>ARENASIZE){
    return "wall";
  }
  if(hero.z>0 || hero.z < -ARENASIZE){
    return "wall";
  }
  if(villain.x<0 || villain.x>ARENASIZE){
    villain.turn(180);
  }
  if(villain.z>0 || villain.z < -ARENASIZE){
    villain.turn(180);
  }
  return 0;
}

// Key listener

var keys = [];

window.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});

function whatKey() {
  if (keys[83]) { // key: S or Move backward
    hero.move(-2.0, 0);
    if(collision()<0){
      hero.move(2.0,0);
      keys[83] = false;
      location.href = "./the-end.html";
    } else if(collision()===1) {
      keys[83] = false;
      location.href = "./the-win.html";
    } else if(collision()==="wall") {
      hero.move(2.0,0);
    }
  }
  if (keys[87]) { // key: W or Move forward
    hero.move(2.0, 0);
    if(collision()<0) {
      hero.move(-2.0,0);
      keys[87] = false;
      location.href = "./the-end.html";
    } else if(collision()===1) {
      keys[87] = false;
      location.href = "./the-win.html";
    } else if(collision()==="wall") {
      hero.turn(180);
    }
  }
  if (keys[65]) { // key: A or Turn left
    hero.turn(-1.5);
    if(collision()===1) {
      keys[65] = false;
    }
  }
  if (keys[68]) { // key: D or Turn right
    hero.turn(1.5);
    if(collision()===1) {
      keys[68] = false;
    }
  }
}
