const GAME_WIDTH = 420;
const GAME_HEIGHT = 620;
const PLAYER_START_Y = 490;
const GROUND_Y = 550;
const PLATFORM_COUNT = 9;
const SCROLL_THRESHOLD = 235;

let player;
let platforms = [];
let heightClimbed = 0;
let gameState = "start";
let bestScore = 0;
let touchDirection = 0;

function setup() {
  const canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
  canvas.parent("game-container");
  canvas.attribute("role", "img");
  canvas.attribute("aria-label", "Skybound Doodle game. Use arrow keys or A and D to move.");
  pixelDensity(1);
  bestScore = loadBestScore();
  resetGame();
  bindTouchControls();
}

function draw() {
  drawSky();
  drawNotebookLines();
  for (const platform of platforms) {
    if (gameState === "playing") platform.update();
    platform.draw();
  }

  if (gameState === "playing") {
    player.updateHorizontal();
    player.updateVertical();
    updateScrollingWorld();
    player.resolvePlatformLandings(platforms);
    checkGameOver();
  }

  player.draw();

  if (gameState === "playing") {
    drawHud();
  } else {
    drawOverlay();
  }
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

function resetGame() {
  player = new Player(width / 2, PLAYER_START_Y);
  heightClimbed = 0;
  generatePlatforms();
}

function bindTouchControls() {
  const controls = [
    { element: document.querySelector("#move-left"), direction: -1 },
    { element: document.querySelector("#move-right"), direction: 1 },
  ];

  for (const control of controls) {
    const startMoving = (event) => {
      event.preventDefault();
      touchDirection = control.direction;
    };
    const stopMoving = (event) => {
      event.preventDefault();
      if (touchDirection === control.direction) touchDirection = 0;
    };

    control.element.addEventListener("pointerdown", startMoving);
    control.element.addEventListener("pointerup", stopMoving);
    control.element.addEventListener("pointercancel", stopMoving);
    control.element.addEventListener("pointerleave", stopMoving);
  }
}

function generatePlatforms() {
  platforms = [];
  platforms.push(new Platform(width / 2 - 70, GROUND_Y, 140, "normal"));

  let platformY = GROUND_Y - 78;
  let previousX = width / 2 - 42;
  for (let index = 1; index < PLATFORM_COUNT; index += 1) {
    const platformWidth = random(72, 102);
    const horizontalShift = random(-125, 125);
    const platformX = constrain(previousX + horizontalShift, 18, width - platformWidth - 18);
    const platformType = index === 3 ? "moving" : index === 5 ? "breakable" : choosePlatformType();
    platforms.push(new Platform(platformX, platformY, platformWidth, platformType));
    previousX = platformX;
    platformY -= random(67, 91);
  }
}

function choosePlatformType() {
  const roll = random();
  if (roll < 0.2) return "moving";
  if (roll < 0.36) return "breakable";
  return "normal";
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
    platform.reset(nextX, topPlatform.y - random(68, 92), nextWidth, choosePlatformType());
  }
}

function keyPressed() {
  if ((keyCode === 32 || keyCode === ENTER) && gameState !== "playing") {
    resetGame();
    gameState = "playing";
  }

  if ([LEFT_ARROW, RIGHT_ARROW, 32].includes(keyCode)) {
    return false;
  }
}

function mousePressed() {
  if (gameState !== "playing" && isPointerOverButton()) {
    resetGame();
    gameState = "playing";
  }
}

function checkGameOver() {
  if (player.y - player.height / 2 <= height + 45) {
    return;
  }

  gameState = "gameover";
  const score = getScore();
  if (score > bestScore) {
    bestScore = score;
    saveBestScore(bestScore);
  }
}

function getScore() {
  return floor(heightClimbed / 10);
}

function drawHud() {
  push();
  noStroke();
  fill(255, 253, 245, 225);
  rect(16, 15, 112, 50, 15);
  fill("#6f7890");
  textFont("Fredoka");
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(11);
  text("HEIGHT", 31, 24);
  fill("#29344a");
  textSize(24);
  text(`${getScore()} m`, 30, 36);
  pop();
}

function drawOverlay() {
  push();
  noStroke();
  fill(41, 52, 74, 105);
  rect(0, 0, width, height);
  fill("#fffdf5");
  rect(38, 86, width - 76, 452, 28);

  textFont("Fredoka");
  textAlign(CENTER, CENTER);
  fill("#29344a");
  textStyle(BOLD);
  textSize(gameState === "start" ? 36 : 34);
  text(gameState === "start" ? "Ready to rise?" : "Clouds got you!", width / 2, 138);

  if (gameState === "start") {
    drawStartInstructions();
  } else {
    drawGameOverStats();
  }

  drawActionButton();
  pop();
}

function drawStartInstructions() {
  fill("#6f7890");
  textStyle(NORMAL);
  textSize(15);
  text("Steer the doodler.\nEvery landing launches another jump.", width / 2, 198);

  const legend = [
    { color: "#62b65c", label: "Normal — steady and safe" },
    { color: "#4ca9d8", label: "Moving — time your landing" },
    { color: "#e99a4b", label: "Breakable — one bounce only" },
  ];
  textAlign(LEFT, CENTER);
  textSize(14);
  for (let index = 0; index < legend.length; index += 1) {
    const rowY = 274 + index * 42;
    fill(legend[index].color);
    rect(85, rowY - 7, 48, 13, 7);
    fill("#29344a");
    text(legend[index].label, 148, rowY);
  }

  fill("#6f7890");
  textAlign(CENTER, CENTER);
  textSize(13);
  text("Move with  ←  →  or  A  D", width / 2, 415);
}

function drawGameOverStats() {
  fill("#6f7890");
  textStyle(NORMAL);
  textSize(15);
  text("That was a brave little bounce.", width / 2, 190);

  fill("#f0f6f8");
  rect(74, 227, 124, 112, 20);
  rect(222, 227, 124, 112, 20);
  fill("#6f7890");
  textStyle(BOLD);
  textSize(11);
  text("HEIGHT", 136, 252);
  text("BEST", 284, 252);
  fill("#29344a");
  textSize(30);
  text(`${getScore()} m`, 136, 292);
  text(`${bestScore} m`, 284, 292);

  fill("#6f7890");
  textStyle(NORMAL);
  textSize(13);
  text("A missed platform is just\na very fast route back down.", width / 2, 382);
}

function drawActionButton() {
  const hovered = isPointerOverButton();
  fill(hovered ? "#f5b63c" : "#ffc857");
  rect(105, 450, 210, 58, 18);
  fill("#29344a");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  text(gameState === "start" ? "START BOUNCING" : "TRY AGAIN", width / 2, 478);
}

function isPointerOverButton() {
  return mouseX >= 105 && mouseX <= 315 && mouseY >= 450 && mouseY <= 508;
}

function loadBestScore() {
  try {
    return Number(window.localStorage.getItem("skybound-doodle-best")) || 0;
  } catch (error) {
    return 0;
  }
}

function saveBestScore(score) {
  try {
    window.localStorage.setItem("skybound-doodle-best", String(score));
  } catch (error) {
    // The game still works when private browsing blocks storage.
  }
}
