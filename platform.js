window.Platform = class Platform {
  constructor(x, y, platformWidth = 88, type = "normal") {
    this.x = x;
    this.y = y;
    this.width = platformWidth;
    this.height = 13;
    this.type = type;
    this.speed = random([1.1, 1.35, -1.1, -1.35]);
    this.broken = false;
    this.fallSpeed = 0;
    this.rotation = 0;
  }

  reset(x, y, platformWidth, type = "normal") {
    this.x = x;
    this.y = y;
    this.width = platformWidth;
    this.type = type;
    this.speed = random([1.1, 1.35, -1.1, -1.35]);
    this.broken = false;
    this.fallSpeed = 0;
    this.rotation = 0;
  }

  update() {
    if (this.type === "moving") {
      this.x += this.speed;
      if (this.x <= 8 || this.x + this.width >= width - 8) {
        this.speed *= -1;
        this.x = constrain(this.x, 8, width - this.width - 8);
      }
    }

    if (this.broken) {
      this.fallSpeed += 0.28;
      this.y += this.fallSpeed;
      this.rotation += 0.035;
    }
  }

  canLand() {
    return !this.broken;
  }

  onLanded() {
    if (this.type === "breakable") {
      this.broken = true;
      this.fallSpeed = 1.8;
    }
  }

  draw() {
    push();
    translate(this.x + this.width / 2, this.y + this.height / 2);
    rotate(this.rotation);
    translate(-this.width / 2, -this.height / 2);
    noStroke();

    // Offset shadow keeps the hand-cut paper look readable.
    fill(41, 52, 74, 30);
    rect(3, 5, this.width, this.height, 8);

    const baseColor = this.type === "moving" ? "#4ca9d8" : this.type === "breakable" ? "#e99a4b" : "#62b65c";
    const highlightColor = this.type === "moving" ? "#9eddf1" : this.type === "breakable" ? "#ffd08a" : "#a5dd73";
    fill(baseColor);
    rect(0, 0, this.width, this.height, 8);
    fill(highlightColor);
    rect(6, 2, this.width - 12, 4, 4);

    if (this.type === "moving") {
      fill(255, 255, 255, 210);
      triangle(this.width / 2 - 9, 7, this.width / 2 - 3, 4, this.width / 2 - 3, 10);
      triangle(this.width / 2 + 9, 7, this.width / 2 + 3, 4, this.width / 2 + 3, 10);
    } else if (this.type === "breakable") {
      stroke("#9a5a32");
      strokeWeight(2);
      noFill();
      beginShape();
      vertex(this.width / 2 - 5, 0);
      vertex(this.width / 2 + 2, 5);
      vertex(this.width / 2 - 2, 9);
      vertex(this.width / 2 + 7, 13);
      endShape();
    }
    pop();
  }
};
