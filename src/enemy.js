export default class Enemy {
  constructor(x, y, imageNumber, level) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.level = level;

    this.showExplosionTimerDefault = 5;
    this.showExplosionTimer = this.showExplosionTimerDefault;

    this.image = new Image();
    this.image.src = `/src/images/pixel_enemy_${imageNumber * this.level}.png`;

    this.isDead = false;
    this.explosionImage = new Image();
    this.explosionImage.src = "/src/images/pixel_enemy_death.png";
  }

  draw(ctx) {
    if (this.isDead) {
      ctx.drawImage(
        this.explosionImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  move(xVelocity, yVelocity) {
    this.x += xVelocity;
    this.y += yVelocity;
  }

  collideWith(sprite) {
    if (
      this.x + this.width > sprite.x &&
      this.x < sprite.x + sprite.width &&
      this.y + this.height > sprite.y &&
      this.y < sprite.y + sprite.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
