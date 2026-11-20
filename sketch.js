const GAME_WIDTH = 420;
const GAME_HEIGHT = 620;
const PLAYER_START_Y = 490;
const GROUND_Y = 550;
const PLATFORM_COUNT = 9;
const SCROLL_THRESHOLD = 235;

let player;
let platforms = [];
let heightClimbed = 0;

function setup() {
  const canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
  canvas.parent("game-container");
  pixelDensity(1);
  player = new Player(width / 2, PLAYER_START_Y);
  generatePlatforms();
}

function draw() {
  drawSky();
  drawNotebookLines();
  for (const platform of platforms) {
    platform.draw();
  }
  player.updateHorizontal();
  player.updateVertical();
  updateScrollingWorld();
  player.resolvePlatformLandings(platforms);
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

function generatePlatforms() {
  platforms = [];
  platforms.push(new Platform(width / 2 - 70, GROUND_Y, 140));

  let platformY = GROUND_Y - 78;
  let previousX = width / 2 - 42;
  for (let index = 1; index < PLATFORM_COUNT; index += 1) {
    const platformWidth = random(72, 102);
    const horizontalShift = random(-125, 125);
    const platformX = constrain(previousX + horizontalShift, 18, width - platformWidth - 18);
    platforms.push(new Platform(platformX, platformY, platformWidth));
    previousX = platformX;
    platformY -= random(67, 91);
  }
}

function updateScrollingWorld() {
  if (player.y >= SCROLL_THRESHOLD || player.velocityY >= 0) {
    return;
  }

  const scrollAmount = SCROLL_THRESHOLD - player.y;
  player.y = SCROLL_THRESHOLD;
  player.previousY += scrollAmount;
  heightClimbed += scrollAmount;

  for (const platform of platforms) {
    platform.y += scrollAmount;
  }

  recyclePlatforms();
}

function recyclePlatforms() {
  for (const platform of platforms) {
    if (platform.y <= height + 30) {
      continue;
    }

    const topPlatform = platforms.reduce((highest, current) =>
      current.y < highest.y ? current : highest,
    );
    const nextWidth = random(70, 100);
    const nextX = constrain(
      topPlatform.x + random(-135, 135),
      18,
      width - nextWidth - 18,
    );
    platform.reset(nextX, topPlatform.y - random(68, 92), nextWidth);
  }
}

function keyPressed() {
  if ([LEFT_ARROW, RIGHT_ARROW, 32].includes(keyCode)) {
    return false;
  }
}
