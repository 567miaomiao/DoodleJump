window.Platform = class Platform {
  constructor(x, y, platformWidth = 88) {
    this.x = x;
    this.y = y;
    this.width = platformWidth;
    this.height = 13;
  }

  draw() {
    push();
    noStroke();

    // Offset shadow keeps the hand-cut paper look readable.
    fill(41, 52, 74, 30);
    rect(this.x + 3, this.y + 5, this.width, this.height, 8);

    fill("#62b65c");
    rect(this.x, this.y, this.width, this.height, 8);
    fill("#a5dd73");
    rect(this.x + 6, this.y + 2, this.width - 12, 4, 4);
    pop();
  }
};
