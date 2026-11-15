const GAME_WIDTH = 420;
const GAME_HEIGHT = 620;
const PLAYER_START_Y = 490;
const GROUND_Y = 550;

let player;

function setup() {
  const canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
  canvas.parent("game-container");
  pixelDensity(1);
  player = new Player(width / 2, PLAYER_START_Y);
}

function draw() {
  drawSky();
  drawNotebookLines();
  drawPracticeGround();
  player.updateHorizontal();
  player.updateVertical();
  player.draw();
  drawControlLabel();
}

function drawSky() {
  background("#fffdf5");
  noStroke();
  fill("#dff5ff");
  rect(0, 0, width, height * 0.58);
}

function drawNotebookLines() {
  stroke(91, 161, 193, 28);
  strokeWeight(1);
  for (let y = 24; y < height; y += 28) {
    line(0, y, width, y);
  }

  stroke(241, 113, 124, 45);
  line(36, 0, 36, height);
}

function drawControlLabel() {
  noStroke();
  fill("#29344a");
  textAlign(CENTER, CENTER);
  textFont("Fredoka");
  textStyle(NORMAL);
  textSize(14);
  text("Automatic bounce engaged!", width / 2, 48);
}

function drawPracticeGround() {
  noStroke();
  fill("#62b65c");
  rect(95, GROUND_Y, 230, 14, 9);
  fill("#3c8248");
  rect(112, GROUND_Y + 9, 196, 8, 5);
}

function keyPressed() {
  if ([LEFT_ARROW, RIGHT_ARROW, 32].includes(keyCode)) {
    return false;
  }
}
