const GAME_WIDTH = 420;
const GAME_HEIGHT = 620;

function setup() {
  const canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
  canvas.parent("game-container");
  pixelDensity(1);
}

function draw() {
  drawSky();
  drawNotebookLines();
  drawPlaceholder();
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

function drawPlaceholder() {
  noStroke();
  fill("#29344a");
  textAlign(CENTER, CENTER);
  textFont("Fredoka");
  textStyle(BOLD);
  textSize(30);
  text("Ready for takeoff?", width / 2, height / 2 - 12);

  fill("#6f7890");
  textStyle(NORMAL);
  textSize(16);
  text("The adventure is being assembled.", width / 2, height / 2 + 28);
}
