import Enemy from "/src/enemy.js";
import movingDirection from "/src/movingDirection.js";

export default class EnemyController {
  enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
  ];
  enemyRows = [];

  currentDirection = movingDirection.right;

  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = 1;
  defaultYVelocity = 1;

  fireBulletTimerDefault = 25;
  fireBulletTimer = this.fireBulletTimerDefault;

  deadEnemies = [];

  // for counting how long the enemies move down then change directions
  moveDownTimerDefault = 30;
  moveDownTimer = this.moveDownTimerDefault;

  constructor(canvas, enemyBulletController, playerBulletController, level) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;
    this.level = level;
    this.createEnemies();
    this.enemyDeathSound = new Audio("/src/audio/enemy_death.ogg");
    this.enemyDeathSound.volume = 0.07;
  }

  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNumber, enemyIndex) => {
        if (enemyNumber > 0) {
          this.enemyRows[rowIndex].push(
            new Enemy(
              5 + enemyIndex * 55,
              rowIndex * 50,
              enemyNumber,
              this.level
            )
          );
        }
      });
    });
  }

  draw(ctx) {
    this.checkDeadEnemies(ctx);
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  collisionDetection() {
    this.enemyRows.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {
          // play audio
          this.enemyDeathSound.currentTime = 0;
          this.enemyDeathSound.play();
          // add to dead enemies
          this.deadEnemies.push(enemy);
          // remove enemy
          enemyRow.splice(enemyIndex, 1);
        }
      });
    });
    this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
  }

  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;
      const allEnemies = this.enemyRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];
      this.enemyBulletController.shoot(
        enemy.x + enemy.width / 2,
        enemy.y + enemy.height,
        -4
      );
    }
  }

  updateVelocityAndDirection() {
    if (this.level === 2) {
      this.defaultXVelocity = 2;
    } else if (this.level === 3) {
      this.defaultXVelocity = 2;
      this.defaultYVelocity = 2;
    }
    for (const enemyRow of this.enemyRows) {
      if (this.currentDirection === movingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;

        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if (rightMostEnemy.x + rightMostEnemy.width + 5 >= this.canvas.width) {
          this.currentDirection = movingDirection.downLeft;
          break;
        }
      } else if (this.currentDirection === movingDirection.downLeft) {
        if (this.moveDown(movingDirection.left)) {
          break;
        }
      } else if (this.currentDirection === movingDirection.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x - 5 <= 0) {
          this.currentDirection = movingDirection.downRight;
          break;
        }
      } else if (this.currentDirection === movingDirection.downRight) {
        if (this.moveDown(movingDirection.right)) {
          break;
        }
      }
    }
  }

  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  // when the enemies are moving down, decrement the timer
  decrementMoveDownTimer() {
    if (
      this.currentDirection === movingDirection.downLeft ||
      this.currentDirection === movingDirection.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  // when the enemies should stop moving down, reset the timer
  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }

  checkDeadEnemies(ctx) {
    this.deadEnemies.forEach((enemy, enemyIndex) => {
      enemy.isDead = true;
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
      enemy.showExplosionTimer--;
      if (enemy.showExplosionTimer <= 0) {
        this.deadEnemies.splice(enemyIndex, 1);
      }
    });
  }
}
