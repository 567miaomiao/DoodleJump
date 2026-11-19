window.Player = class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.previousY = y;
    this.width = 38;
    this.height = 46;
    this.velocityX = 0;
    this.velocityY = -11.5;
    this.acceleration = 0.62;
    this.maxSpeed = 6.2;
    this.drag = 0.84;
    this.gravity = 0.45;
    this.jumpStrength = 11.8;
    this.facing = 1;
    this.squash = 0;
  }

  updateHorizontal() {
    const movingLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65);
    const movingRight = keyIsDown(RIGHT_ARROW) || keyIsDown(68);

    if (movingLeft !== movingRight) {
      const direction = movingLeft ? -1 : 1;
      this.velocityX += direction * this.acceleration;
      this.facing = direction;
    } else {
      this.velocityX *= this.drag;
    }

    this.velocityX = constrain(this.velocityX, -this.maxSpeed, this.maxSpeed);
    this.x += this.velocityX;
    this.wrapAroundScreen();
  }

  wrapAroundScreen() {
    const halfWidth = this.width / 2;
    if (this.x < -halfWidth) {
      this.x = width + halfWidth;
    } else if (this.x > width + halfWidth) {
      this.x = -halfWidth;
    }
  }

  updateVertical() {
    this.previousY = this.y;
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.squash = lerp(this.squash, 0, 0.16);
  }

  resolvePlatformLandings(platformList) {
    if (this.velocityY <= 0) {
      return;
    }

    const previousFeet = this.previousY + this.height / 2;
    const currentFeet = this.y + this.height / 2;
    const playerLeft = this.x - this.width * 0.32;
    const playerRight = this.x + this.width * 0.32;

    for (const platform of platformList) {
      const overlapsHorizontally =
        playerRight > platform.x && playerLeft < platform.x + platform.width;
      const crossedPlatformTop = previousFeet <= platform.y && currentFeet >= platform.y;

      if (overlapsHorizontally && crossedPlatformTop) {
        this.y = platform.y - this.height / 2;
        this.jump();
        return;
      }
    }
  }

  jump() {
    this.velocityY = -this.jumpStrength;
    this.squash = 0.18;
  }

  draw() {
    push();
    translate(this.x, this.y);
    const stretch = constrain(-this.velocityY * 0.006, -0.06, 0.08);
    scale(this.facing * (1 + this.squash - stretch), 1 - this.squash + stretch);

    // Backpack
    noStroke();
    fill("#f26d6d");
    rect(-23, -10, 14, 27, 6);

    // Body and head
    fill("#78c86f");
    ellipse(0, 8, this.width, 36);
    fill("#a9df78");
    ellipse(3, -14, 35, 31);

    // Snout and eye
    fill("#f3f0c6");
    ellipse(18, -10, 20, 14);
    fill("#29344a");
    circle(7, -20, 5);
    circle(24, -11, 3);

    // Feet
    stroke("#29344a");
    strokeWeight(4);
    strokeCap(ROUND);
    line(-12, 23, -19, 27);
    line(8, 23, 16, 27);
    pop();
  }
};
