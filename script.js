"use strict";

var glo = {
  round: 0,
  moving: true
}

var init = function (moves, noRev, decr) { //set up the display and gridValues
  document.getElementById('info'+"-"+glo.round).classList.add('removed');
  //set/reset globals
  glo.dim = 5; //dimension of grid, must be odd integer
  glo.pos = [Math.floor(glo.dim/2), Math.floor(glo.dim/2)];
  glo.highest = 0;
  glo.values = [];
  glo.noRevisits = noRev;
  glo.initMoves = moves;
  glo.moveLimit = moves;
  glo.decrementing = decr;
  //
  document.getElementById('game').classList.remove('removed');
  var ground = document.getElementById('ground');
  //center background
  ground.style.left = "50%";
  ground.style.top = "50%";
  //set the dimensions based on 'dim'
  ground.style.width = ground.style.height = (25*glo.dim)+'vmin';
  ground.style.maxWidth = ground.style.maxHeight = (125*glo.dim)+'px';
  //remove old tiles(if there are any)
  var children = ground.childNodes.length;
  for (var i = 0; i < children; i++) {
    ground.removeChild(ground.childNodes[0]);
  }
  //fill in tiles
  for (var i = 0; i < glo.dim; i++) {
    glo.values.push([]);
    for (var j = 0; j < glo.dim; j++) {
      var tile = document.createElement("div");
      tile.setAttribute('class', 'tile');
      var img = document.createElement("img");
      var rand = Math.floor(Math.random()*(12));
      if (rand > 9) {rand = 0;}
      else if (rand > 7) {rand = 1;}
      img.setAttribute('class', 'sprite-'+rand);
      img.setAttribute('src', 'img.png');
      tile.appendChild(img);
      ground.appendChild(tile);
      //set spot value
      glo.values[i].push(Math.floor(Math.random()*(101)));
      if (glo.values[i][j] > glo.highest) {glo.highest = glo.values[i][j];}
    }
  }
  protag.classList.add('sprite-16');
  document.getElementById('protag').classList.remove('sprite-21');
  // display value of initial spot
  document.getElementById('cur-spot-val').innerHTML = glo.values[glo.pos[0]][glo.pos[1]];
  document.getElementById('mov-rem').innerHTML = glo.moveLimit;
}

var move = function (dir) {
  if (glo.moving || glo.moveLimit === 0) {return;}
  var oldPos = [glo.pos[0], glo.pos[1]];
  //check for grid edge, update pos, assign the protag's animation frames
  switch (dir) {
    case 'left':
      if (glo.pos[1] === 0) {return;}
      glo.pos[1]--;
      var f1 = 'sprite-8'
      var f2 = 'sprite-9'
      break;
    case "right":
      if (glo.pos[1] === glo.dim-1) {return;}
      glo.pos[1]++;
      var f1 = 'sprite-10'
      var f2 = 'sprite-11'
      break;
    case 'top':
      if (glo.pos[0] === 0) {return;}
      glo.pos[0]--;
      var f1 = 'sprite-12'
      var f2 = 'sprite-13'
      break;
    case "bottom":
      if (glo.pos[0] === glo.dim-1) {return;}
      glo.pos[0]++;
      var f1 = 'sprite-14'
      var f2 = 'sprite-15'
      break;
  }
  glo.moving = true;
  if (glo.noRevisits) { //
    glo.values[oldPos[0]][oldPos[1]] = 0;
  }
  //slide the background
  var ground = document.getElementById('ground');
  var x = 25; //  tileSize, as percentage of mainWindow
  if (dir === "right" || dir === "bottom") {var x = -x;}
  if (dir === 'right') {dir = "left"}
  else if (dir === 'bottom') {dir = "top"}
  ground.style[dir] = (Number(ground.style[dir].slice(0,-1)) + x) + "%";
  //animate the protag
  var animate = function (frame1, frame2, count) {
    protag.classList.toggle(frame1);
    protag.classList.toggle(frame2);
    if (count < 6) {
      setTimeout(function () {
        animate(frame1, frame2, count+1);
      }, 100);
    } else {
      protag.classList.add('sprite-16');
      protag.classList.remove(frame1);
      protag.classList.remove(frame2);
      glo.moveLimit--;
      document.getElementById('mov-rem').innerHTML = glo.moveLimit;
      glo.moving = false;
      if (glo.decrementing) {
        for (var i = 0; i < glo.values.length; i++) {
          for (var j = 0; j < glo.values[i].length; j++) {
            glo.values[i][j]--;
          }
        }
      }
      document.getElementById('cur-spot-val').innerHTML = glo.values[glo.pos[0]][glo.pos[1]];
    }
  }
  var protag = document.getElementById('protag');
  protag.classList.add(f1);
  protag.classList.remove('sprite-16');
  animate(f1, f2, 0)
}

var mine = function () {
  if (glo.moving) {return;}
  glo.moving = true;
  var animate = function (count) {
    protag.classList.toggle('sprite-22');
    protag.classList.toggle('sprite-23');
    if (count < 12) {
      setTimeout(function () {
        animate(count+1);
      }, 100);
    } else {
      protag.classList.add('sprite-21');
      protag.classList.remove('sprite-22');
      protag.classList.remove('sprite-23');
      // END THE ROUND
      setTimeout(function () {
        document.getElementById('score'+"-"+glo.round).innerHTML = glo.values[glo.pos[0]][glo.pos[1]];
        document.getElementById('highest'+"-"+glo.round).innerHTML = glo.highest;
        document.getElementById('end'+"-"+glo.round).classList.remove('removed');
      }, 500);
    }
  }
  var protag = document.getElementById('protag');
  protag.classList.add('sprite-22');
  protag.classList.remove('sprite-16');
  animate(0)
}

var next = function () {
  document.getElementById('end'+"-"+glo.round).classList.add('removed');
  document.getElementById('game').classList.add('removed');
  glo.round++;
  document.getElementById('info'+"-"+glo.round).classList.remove('removed');
}

var again = function () {
  document.getElementById('end'+"-"+glo.round).classList.add('removed');
  init(glo.initMoves, glo.noRevisits, glo.decrementing);
  setTimeout(function () {
    glo.moving = false;
  }, 600);
}

window.onkeypress = function(e) {  //keyboard listner/handler
  var key = e.charCode || e.keyCode || e.which;
  switch (key) {
    case 32:  // space
      mine();
      return false;
      break;
    case 87:  // W
    case 119:  // W
      move('top')
      break;
    case 97:  // A
    case 65:  // A
      move('left')
      break;
    case 83:  // S
    case 115:  // S
      move('bottom')
      break;
    case 68:  // D
    case 100:  // D
      move('right')
      break;
  }
}
