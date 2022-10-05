import Bullet from "/bullet.js";

export default class BulletController {
  bullets = [];
  timeTillNextBullet = 0;
  timeTillShooterUpgrade = 380;
  hasFired = false;

  constructor(
    canvas,
    bulletColor,
    bulletType,
    level,
    shipNum,
    isDoubleShooter,
    isChallenging
  ) {
    this.canvas = canvas;
    this.bulletColor = bulletColor;
    this.bulletType = bulletType;
    this.level = level;
    this.shipNum = shipNum;
    this.isDoubleShooter = isDoubleShooter;
    this.isChallenging = isChallenging;

    this.doubleShooterAudio = new Audio("/audio/small-win.wav");
    this.doubleShooterAudio.volume = 0.6;

    this.shootSound = new Audio("/audio/" + bulletType + "_laser.ogg");
    if (this.bulletType === "player") this.shootSound.volume = 0.1;
    else this.shootSound.volume = 0.01;

    if (this.shipNum === 7 && this.bulletType === "player") {
      this.bulletColor = "#e75eff";
    } else if (this.shipNum === 5 && this.bulletType === "player") {
      this.bulletColor = "#6eddff";
    } else if (this.shipNum === 9 && this.bulletType === "player") {
      this.bulletColor = "#d40000";
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
      } else if (this.shipNum === 7 && this.bulletType === "player") {
        const bullet1 = new Bullet(
          this.canvas,
          x - 18,
          y,
          velocity,
          this.bulletColor
        );
        this.bullets.push(bullet1);
      } else if (this.shipNum === 6 && this.bulletType === "player") {
        const bullet1 = new Bullet(
          this.canvas,
          x - 25,
          y,
          velocity,
          this.bulletColor
        );
        const bullet2 = new Bullet(
          this.canvas,
          x + 21,
          y,
          velocity,
          this.bulletColor
        );
        this.bullets.push(bullet1, bullet2);
      } else if (this.shipNum === 9 && this.bulletType === "player") {
        const bullet = new Bullet(
          this.canvas,
          x - 5,
          y,
          velocity,
          this.bulletColor
        );
        this.bullets.push(bullet);
      } else if (
        this.shipNum === 10 &&
        this.bulletType === "player" &&
        this.isChallenging &&
        this.isDoubleShooter
      ) {
        const bullet1 = new Bullet(
          this.canvas,
          x - 16,
          y,
          velocity,
          this.bulletColor
        );
        const bullet2 = new Bullet(
          this.canvas,
          x + 12,
          y,
          velocity,
          this.bulletColor
        );
        this.bullets.push(bullet1, bullet2);
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

    if (
      this.bulletType === "player" &&
      this.isChallenging &&
      this.level === 1 &&
      !this.hasFired &&
      !this.isDoubleShooter
    ) {
      this.upgradeShooter(ctx);
    }
  }

  upgradeShooter(ctx) {
    if (this.bullets.length > 0) {
      this.hasFired = true;
    } else if (this.timeTillShooterUpgrade > 0) {
      ctx.fillStyle = "#9df716";
      ctx.font = "bold 20px Courier New";
      ctx.fillText(
        `Time till upgrade: ${this.timeTillShooterUpgrade}`,
        320,
        30
      );
      this.timeTillShooterUpgrade--;
    } else if (this.timeTillShooterUpgrade === 0) {
      this.doubleShooterAudio.play();
      this.isDoubleShooter = true;
    }
  }
}
