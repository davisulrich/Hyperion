export default class Player {
  rightPressed = false;
  leftPressed = false;
  spacePressed = false;

  constructor(canvas, velocity, bulletController, shipNum) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;
    this.shipNum = shipNum;

    this.width = 53;
    this.height = 53;

    this.x = this.canvas.width / 2 - this.width / 2;
    this.y = this.canvas.height - this.height - 40;

    this.image = new Image();
    this.image.src = `/src/images/pixel_ship_${this.shipNum}.png`;

    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);
    // console.log(this.image.src);
  }

  draw(ctx) {
    if (this.spacePressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 10, 7);
    }
    this.move();
    this.collideWithWalls();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  collideWithWalls() {
    // right wall
    if (this.x + this.width >= this.canvas.width) {
      this.x = this.canvas.width - this.width;
      // left wall
    } else if (this.x <= 0) {
      this.x = 0;
    }
  }

  keyDown = (event) => {
    if (event.code === "ArrowRight") {
      this.rightPressed = true;
    }
    if (event.code === "ArrowLeft") {
      this.leftPressed = true;
    }
    if (event.code === "Space") {
      this.spacePressed = true;
    }
  };

  keyUp = (event) => {
    if (event.code === "ArrowRight") {
      this.rightPressed = false;
    }
    if (event.code === "ArrowLeft") {
      this.leftPressed = false;
    }
    if (event.code === "Space") {
      this.spacePressed = false;
    }
  };
}
