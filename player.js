window.Player = class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.previousY = y;
    this.width = 38;
    this.height = 46;
    this.velocityY = -11.5;
    this.speed = 5;
    this.gravity = 0.45;
    this.jumpForce = -11.8;
  }

  updateHorizontal() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }

    if (this.x > width + this.width / 2) {
      this.x = -this.width / 2;
    }
    if (this.x + this.width / 2 < 0) {
      this.x = width + this.width / 2;
    }
  }

  updateVertical() {
    this.previousY = this.y;
    this.velocityY += this.gravity;
    this.y += this.velocityY;
  }

  resolvePlatformLandings(platformList) {
    for (const platform of platformList) {
      if (this.isColliding(platform)) {
        this.y = platform.y - this.height / 2;
        platform.onLanded();
        this.jump();
        break;
      }
    }
  }

  isColliding(platform) {
    if (
      this.velocityY > 0 &&
      platform.canLand() &&
      this.x + this.width / 2 > platform.x &&
      this.x - this.width / 2 < platform.x + platform.width &&
      this.previousY + this.height / 2 <= platform.y &&
      this.y + this.height / 2 >= platform.y
    ) {
      return true;
    }
    return false;
  }

  jump() {
    this.velocityY = this.jumpForce;
  }

  draw() {
    push();
    translate(this.x, this.y);

    noStroke();
    fill("#78c86f");
    ellipse(0, 8, this.width, 36);
    fill("#a9df78");
    ellipse(3, -14, 35, 31);

    fill("#f3f0c6");
    ellipse(18, -10, 20, 14);
    fill("#29344a");
    circle(7, -20, 5);
    circle(24, -11, 3);

    stroke("#29344a");
    strokeWeight(4);
    strokeCap(ROUND);
    line(-12, 23, -19, 27);
    line(8, 23, 16, 27);
    pop();
  }
};
