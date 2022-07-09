import Bullet from "/src/bullet.js";

export default class BulletController {
  bullets = [];
  timeTillNextBullet = 0;

  constructor(canvas, bulletColor, bulletType, level, shipNum) {
    this.canvas = canvas;
    this.bulletColor = bulletColor;
    this.bulletType = bulletType;
    this.level = level;
    this.shipNum = shipNum;

    this.shootSound = new Audio("/src/audio/" + bulletType + "_laser.ogg");
    if (this.bulletType === "player") this.shootSound.volume = 0.1;
    else this.shootSound.volume = 0.01;

    if (this.level === 3 && this.bulletType === "player") {
      this.bulletColor = "#6eddff";
    }
    if (this.shipNum === 4 && this.bulletType === "player") {
      this.bulletColor = "#e75eff";
    }
  }

  shoot(x, y, velocity, timeTillNextBullet = 7) {
    if (this.timeTillNextBullet <= 0) {
      // double shooter
      if (this.shipNum === 3 && this.bulletType === "player") {
        const bullet1 = new Bullet(
          this.canvas,
          x - 20,
          y,
          velocity,
          this.bulletColor
        );
        const bullet2 = new Bullet(
          this.canvas,
          x + 16,
          y,
          velocity,
          this.bulletColor
        );
        this.bullets.push(bullet1, bullet2);
      } else if (this.shipNum === 4 && this.bulletType === "player") {
        const bullet1 = new Bullet(
          this.canvas,
          x - 18,
          y,
          velocity,
          this.bulletColor
        );
        this.bullets.push(bullet1);
      } else {
        const bullet = new Bullet(
          this.canvas,
          x - 2,
          y,
          velocity,
          this.bulletColor
        );
        this.bullets.push(bullet);
      }

      this.timeTillNextBullet = timeTillNextBullet;
      this.shootSound.currentTime = 0;
      this.shootSound.play();
    }
  }

  collideWith(sprite) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.bulletCollide(sprite)
    );
    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }
    return false;
  }

  draw(ctx) {
    this.bullets = this.bullets.filter(
      (bullet) =>
        bullet.y + bullet.height > 0 &&
        bullet.y <= this.canvas.height - bullet.height - 60
    );
    this.bullets.forEach((bullet) => bullet.draw(ctx));
    if (this.timeTillNextBullet > 0) {
      this.timeTillNextBullet--;
    }
  }
}
