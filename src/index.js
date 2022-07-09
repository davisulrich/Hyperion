// Youtube: https://www.youtube.com/watch?v=qCBiKJbLcFI

// To do:
// - make a dolphin shooter
// - crisp pixelly images?
// - get rid of x is null error messages
// - make more easter eggs
// - decide on a rule for double shooting, implement it
// - design new ships

import EnemyController from "/src/enemyController.js";
import Player from "/src/player.js";
import BulletController from "/src/bulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_STATE = {
  STARTSCREEN: 0,
  RUNNING: 1,
  GAMEOVER: 2,
  INSTRUCTIONS: 3
};
let gameState = GAME_STATE.STARTSCREEN;
let current_level = 1;
let shipNum = 1;

let isGameOver = false;
let didWin = false;

canvas.width = 600;
canvas.height = 625;

const background = new Image();
background.src = "/src/images/pixel_stars.jpg";
const hyperionTitle = new Image();
hyperionTitle.src = "/src/images/hyperion.png";
const hyperionMoon = new Image();
hyperionMoon.src = "/src/images/hyperion_moon.jpg";
const enemy2 = new Image();
enemy2.src = "/src/images/pixel_enemy_2.png";

const ship1 = new Image();
ship1.src = "/src/images/pixel_ship_1.png";
const ship2 = new Image();
ship2.src = "/src/images/pixel_ship_2.png";
const ship3 = new Image();
ship3.src = "/src/images/pixel_ship_3.png";
const ship4 = new Image();
ship4.src = "/src/images/pixel_ship_4.png";

const gameStartAudio = new Audio("src/audio/computerNoise_000.ogg");
gameStartAudio.volume = 0.022;
const levelUpSound = new Audio("/src/audio/level-up.wav");
levelUpSound.volume = 0.35;
const playerWinSound = new Audio("/src/audio/small-win.wav");
playerWinSound.volume = 0.25;
const playerDeathSound = new Audio("/src/audio/fast-game-over.wav");
playerDeathSound.volume = 0.15;

const gasolina = new Audio("src/audio/Gasolina.mp3");
gasolina.volume = 0.45;
const vocalFunction = new Audio("src/audio/VocalFunction.mp3");
vocalFunction.volume = 0.45;
const inDaClub = new Audio("src/audio/InDaClub.mp3");
inDaClub.volume = 0.45;
const runIt = new Audio("src/audio/runIt.mp3");
runIt.volume = 0.45;
const byeByeBye = new Audio("src/audio/byeByeBye.mp3");
byeByeBye.volume = 0.45;
const pony = new Audio("src/audio/pony.mp3");
pony.volume = 0.45;
const oldTownRoad = new Audio("src/audio/oldTownRoad.mp3");
oldTownRoad.volume = 0.45;
const donlimma = new Audio("src/audio/Donlimma.mp3");
donlimma.volume = 0.45;

let levelUpTextTimer = 40;
const level1Image = new Image();
level1Image.src = "/src/images/level_1.png";
const level2Image = new Image();
level2Image.src = "/src/images/level_2.png";
const level3Image = new Image();
level3Image.src = "/src/images/level_3.png";

// event listener arrow function
let startGame = (event) => {
  if (
    event.code === "Space" ||
    event.code === "Digit1" ||
    event.code === "Digit2" ||
    event.code === "Digit3" ||
    event.code === "Digit7" ||
    event.code === "KeyI" ||
    event.code === "Escape"
  ) {
    if (gameState === GAME_STATE.STARTSCREEN && event.code === "KeyI") {
      donlimma.currentTime = 0;
      donlimma.play();
      gameState = GAME_STATE.INSTRUCTIONS;
      return;
    }
    if (gameState === GAME_STATE.INSTRUCTIONS && event.code === "Escape") {
      donlimma.pause();
      gameState = GAME_STATE.STARTSCREEN;
      return;
    }
    if (gameState === GAME_STATE.STARTSCREEN || isGameOver) {
      if (event.code === "Digit2") {
        shipNum = 2;
        player = new Player(canvas, 18, playerBulletController, shipNum);
      }
      if (event.code === "Digit3") {
        shipNum = 3;
        playerBulletController = new BulletController(
          canvas,
          "#9df716",
          "player",
          current_level,
          shipNum
        );
        enemyController = new EnemyController(
          canvas,
          enemyBulletController,
          playerBulletController,
          current_level
        );
        player = new Player(canvas, 18, playerBulletController, shipNum);
      }
      if (event.code === "Digit7") {
        shipNum = 4;
        playerBulletController = new BulletController(
          canvas,
          "#9df716",
          "player",
          current_level,
          shipNum
        );
        enemyController = new EnemyController(
          canvas,
          enemyBulletController,
          playerBulletController,
          current_level
        );
        player = new Player(canvas, 18, playerBulletController, shipNum);
      }
      // if you lost, reset everything
      if (isGameOver) {
        resetAllVariables();
      }
      gameState = GAME_STATE.RUNNING;
      gameStartAudio.play();
      if (shipNum === 4) {
        oldTownRoad.currentTime = 0;
        oldTownRoad.play();
      } else {
        gasolina.currentTime = 0;
        inDaClub.pause();
        gasolina.play();
      }
    }
  }
};

document.addEventListener("keydown", startGame);

// important variables
let playerBulletController = new BulletController(
  canvas,
  "#9df716",
  "player",
  current_level,
  shipNum
);
let enemyBulletController = new BulletController(
  canvas,
  "red",
  "enemy",
  current_level,
  shipNum
);

let enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController,
  current_level
);

let player = new Player(canvas, 18, playerBulletController, shipNum);

// game loop
function game() {
  if (gameState === GAME_STATE.STARTSCREEN) {
    showStartScreen(ctx);
  } else if (gameState === GAME_STATE.INSTRUCTIONS) {
    showInstructions(ctx);
  } else if (gameState === GAME_STATE.RUNNING) {
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if (!isGameOver) {
      enemyController.draw(ctx);
      player.draw(ctx);
      // shows the Current Level Image, allows bullets to pass over
      if (levelUpTextTimer >= 0) {
        if (current_level === 1) {
          ctx.drawImage(level1Image, 200, 300, 186, 48);
        } else if (current_level === 2) {
          ctx.drawImage(level2Image, 200, 300, 186, 48);
        } else if (current_level === 3) {
          ctx.drawImage(level3Image, 200, 300, 186, 48);
        }
        levelUpTextTimer--;
      }
      playerBulletController.draw(ctx);
      enemyBulletController.draw(ctx);
    }
  }
}

function resetAllVariables() {
  current_level = 1;
  isGameOver = false;
  didWin = false;
  levelUpTextTimer = 40;

  playerBulletController = new BulletController(
    canvas,
    "#9df716",
    "player",
    current_level,
    shipNum
  );
  enemyBulletController = new BulletController(
    canvas,
    "red",
    "enemy",
    current_level,
    shipNum
  );

  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
    current_level
  );
  player = new Player(canvas, 18, playerBulletController, shipNum);
}

function levelUp() {
  levelUpTextTimer = 40;

  playerBulletController = new BulletController(
    canvas,
    "#9df716",
    "player",
    current_level,
    shipNum
  );
  enemyBulletController = new BulletController(
    canvas,
    "red",
    "enemy",
    current_level,
    shipNum
  );
  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
    current_level
  );
  player = new Player(canvas, 18, playerBulletController, shipNum);

  levelUpSound.play();
}

function showStartScreen(ctx) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(ship1, 95, canvas.height - 157, 75, 75);
  ctx.drawImage(ship2, 265, canvas.height - 160, 75, 75);
  ctx.drawImage(ship3, 430, canvas.height - 160, 75, 75);
  ctx.drawImage(hyperionTitle, 30, 50, 550, 260);
  ctx.fillStyle = "white";
  ctx.font = "bold 24px Courier New";
  const text4 = "Select your ship:";
  ctx.fillText(text4, canvas.width / 3.4, canvas.height / 2 + 70);

  ctx.font = "20px Courier New";
  const text5 = "Press 1:";
  ctx.fillText(text5, canvas.width / 7, canvas.height / 1.42);
  const text6 = "Press 2:";
  ctx.fillText(text6, canvas.width / 2.35, canvas.height / 1.42);
  const text7 = "Press 3:";
  ctx.fillText(text7, (3 * canvas.width) / 4 - 30, canvas.height / 1.42);

  ctx.font = "17px Courier New";
  const text8 = '"Starship"';
  ctx.fillText(text8, canvas.width / 7 - 5, canvas.height / 1.08);
  const text9 = '"Frog-Zap"';
  ctx.fillText(text9, canvas.width / 2.36, canvas.height / 1.08);
  const text10 = '"Houdini"';
  ctx.fillText(text10, (3 * canvas.width) / 4 - 26, canvas.height / 1.08);
}

function showInstructions(ctx) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(hyperionTitle, 150, 30, 300, 120);

  const textOriginX = 50;
  const textOriginY = 211;
  ctx.fillStyle = "#adadad";
  ctx.font = "bold 36px Courier New";
  const text1 = "INSTRUCTIONS:";
  ctx.fillText(text1, textOriginX + 110, textOriginY);

  ctx.font = "24px Courier New";
  const text2 = "You must shoot the aliens who";
  ctx.fillText(text2, textOriginX, 270);
  const text3 = "are attempting to destroy";
  ctx.fillText(text3, textOriginX, 310);
  const text4 = "Saturn's Moon, Hyperion.";
  ctx.fillText(text4, textOriginX, 350);
  const text5 = "You have one life.";
  ctx.fillText(text5, textOriginX, 410);
  const text5a = "Press ESC to go back.";
  ctx.fillText(text5a, textOriginX, 470);

  ctx.fillRect(80, 530, 280, 40);
  ctx.fillRect(420, 530, 50, 40);
  ctx.fillRect(500, 530, 50, 40);

  ctx.font = "20px Courier New";
  const text6 = "TO SHOOT:";
  ctx.fillText(text6, 160, 520);
  const text7 = "TO MOVE:";
  ctx.fillText(text7, 435, 520);

  ctx.fillStyle = "black";
  const text8 = "SPACEBAR";
  ctx.fillText(text8, 165, 555);
  const text9 = "<";
  ctx.fillText(text9, 440, 555);
  const text10 = ">";
  ctx.fillText(text10, 520, 555);

  ctx.fillStyle = "#9df716";
  ctx.drawImage(ship1, 490, 400, 53, 53);
  ctx.fillRect(514, 300, 3.75, 15);
  ctx.drawImage(enemy2, 490, 150, 50, 50);
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }
  if (
    enemyBulletController.collideWith(player) ||
    enemyController.collideWith(player)
  ) {
    isGameOver = true;
    oldTownRoad.pause();
    gasolina.pause();
    vocalFunction.pause();
    inDaClub.pause();
    playerDeathSound.play();
  }
  if (enemyController.enemyRows.length > 0) {
    const bottomMostEnemy =
      enemyController.enemyRows[enemyController.enemyRows.length - 1][0];
    if (bottomMostEnemy.y + bottomMostEnemy.height >= canvas.height) {
      isGameOver = true;
      playerDeathSound.play();
    }
  }
  if (enemyController.enemyRows.length === 0) {
    if (current_level === 1) {
      current_level = 2;
      if (shipNum !== 4) {
        gasolina.pause();
        vocalFunction.currentTime = 0;
        vocalFunction.play();
      }
      levelUp();
      return;
    } else if (current_level === 2) {
      current_level = 3;
      if (shipNum !== 4) {
        vocalFunction.pause();
        inDaClub.currentTime = 0;
        inDaClub.play();
      }
      levelUp();
      return;
    } else if (current_level === 3) {
      didWin = true;
      isGameOver = true;
      playerWinSound.play();
    }
  }
}

function displayGameOver() {
  if (isGameOver) {
    // you won!
    if (didWin) {
      let text = "You Saved Hyperion!";
      ctx.fillStyle = "white";
      ctx.font = "45px Courier New";
      ctx.fillText(text, 50, canvas.height / 5);

      ctx.drawImage(hyperionMoon, 175, 155, 250, 250);

      let text2 = "Press Space Bar to Restart";
      ctx.font = "20px Courier New";
      ctx.fillText(text2, canvas.width / 4, (4 * canvas.height) / 5);
    }
    // you lost :(
    else {
      let text = "Game Over!";
      ctx.fillStyle = "white";
      ctx.font = "70px Courier New";
      ctx.fillText(text, canvas.width / 6, canvas.height / 2.2);

      let text2 = "Press Space Bar to Restart";
      ctx.font = "20px Courier New";
      ctx.fillText(text2, canvas.width / 4, (3 * canvas.height) / 5);
    }
  }
}

setInterval(game, 1000 / 20);
