// Youtube: https://www.youtube.com/watch?v=qCBiKJbLcFI

// To do:
// - multiple ships for challenging level
// - add more levels
// - start loading next level enemy images on current level
// - leaderboard LEADERBOARD -Liam
// - invisible enemies
// - make it more about dodging bullts less about the speed of enemies?
// - make the levels more gradual - alternate shoot rate and velocity
// - indicate that enemy hasn't died even tho you shot it
// - add a ship for number 4 and 8
// - add to instructions - press a random number to use a mystery ship
// - instructions: PRESS C for a challenge version
// - make your own profile, shop for ships, upload a photo to be your ship, and store off your most recent tries
// - make it an iPhone app

// Done:
// - flashing level signs for level 7 and 9
// - 3 lives for challenging level - pick up at beginning of level u left off on
// - make a noise for getting double shooter
// - need a way to pass double shooter variable to new levels
// - create level 4 - 10 signs for beginning of level
// - have to earn double shooting
// - add 4 more levels
// - new enemy capabilities:
//        - have to shoot twice to kill
//        - shoot more bullets

import EnemyController from "/enemyController.js";
import Player from "/player.js";
import BulletController from "/bulletController.js";
import showStartScreenF from "/startScreens.js";
import showInstructionsF from "/instructionsScreen.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_STATE = {
  STARTSCREEN: 0,
  RUNNING: 1,
  INSTRUCTIONS: 2,
  LOSTLIFE: 3,
};

let gameState = GAME_STATE.STARTSCREEN;
let current_level = 1;
let shipNum = 1;
let playerLives = 3;
let isDoubleShooter = false;
let isChallenging = false;

let isGameOver = false;
let didWin = false;

canvas.width = 600;
canvas.height = 625;

// #region Images and Audio
const background = new Image();
background.src = "/images/pixel_stars.jpg";
const hyperionTitle = new Image();
hyperionTitle.src = "/images/hyperion.png";
const hyperionMoon = new Image();
hyperionMoon.src = "/images/hyperion_moon.jpg";
const hyperionMoonBurning = new Image();
hyperionMoonBurning.src = "/images/hyperion_moon_burning.png";
const hyperionMoonHappy = new Image();
hyperionMoonHappy.src = "/images/hyperion_moon_happy.png";
const enemy2 = new Image();
enemy2.src = "/images/pixel_enemy_2.png";
const enemy4 = new Image();
enemy4.src = "/images/pixel_enemy_4.png";
const enemy6 = new Image();
enemy6.src = "/images/pixel_enemy_6.png";

const ship1 = new Image();
ship1.src = "/images/pixel_ship_1.png";
const ship2 = new Image();
ship2.src = "/images/pixel_ship_2.png";
const ship3 = new Image();
ship3.src = "/images/pixel_ship_3.png";

const gameStartAudio = new Audio("audio/computerNoise_000.ogg");
gameStartAudio.volume = 0.022;
const levelUpSound = new Audio("/audio/level-up.wav");
levelUpSound.volume = 0.35;
const playerWinSound = new Audio("/audio/small-win.wav");
playerWinSound.volume = 0.25;
const playerDeathSound = new Audio("/audio/fast-game-over.wav");
playerDeathSound.volume = 0.15;

const gasolina = new Audio("audio/Gasolina.mp3");
gasolina.volume = 0.45;
const vocalFunction = new Audio("audio/VocalFunction.mp3");
vocalFunction.volume = 0.45;
const inDaClub = new Audio("audio/InDaClub.mp3");
inDaClub.volume = 0.45;
const oldTownRoad = new Audio("audio/oldTownRoad.mp3");
oldTownRoad.volume = 0.45;
const donlimma = new Audio("audio/Donlimma.mp3");
donlimma.volume = 0.45;
const rage = new Audio("audio/GuerrillaRadio.mp3");
rage.volume = 0.45;
const dropTop = new Audio("audio/Droptop.mp3");
dropTop.volume = 0.45;
const zeze = new Audio("audio/Zeze.mp3");
zeze.volume = 0.45;
const loveScars = new Audio("audio/LoveScars.mp3");
loveScars.volume = 0.45;
const rosalia = new Audio("audio/TKN.mp3");
rosalia.volume = 0.45;
const spaceCadet = new Audio("audio/SpaceCadet.mp3");
spaceCadet.volume = 0.45;
const aLot = new Audio("audio/ALot.mp3");
aLot.volume = 0.45;
const dior = new Audio("audio/Dior.mp3");
dior.volume = 0.45;
const dancingQueen = new Audio("audio/DancingQueen.mp3");
dancingQueen.volume = 0.45;
const starsOn45 = new Audio("audio/StarsOn45.m4a");
starsOn45.volume = 0.45;
const boyfriend = new Audio("audio/Boyfriend.mp3");
boyfriend.volume = 0.65;
const intoTheGroove = new Audio("audio/IntoTheGroove.mp3");
intoTheGroove.volume = 0.45;
const sexyBack = new Audio("audio/SexyBack.mp3");
sexyBack.volume = 0.45;
const immaBe = new Audio("audio/ImmaBe.mp3");
immaBe.volume = 0.55;
const hypnotize = new Audio("audio/Hypnotize.mp3");
hypnotize.volume = 0.45;
const returnOfTheMack = new Audio("audio/ReturnoftheMack.mp3");
returnOfTheMack.volume = 0.75;

// timer for how long until to show the next rage photo
let rageNum = 1;
let nextRagePhotoTimer = 100;
let showRagePhoto = false;
let ragePhotoTimer = 40;
let rage_photo = new Image();
rage_photo.src = `/images/rage_${rageNum}.png`;

let levelUpTextTimer = 40;
let showLevel = true;
let levelFlashTimer = 15;

const level1Image = new Image();
level1Image.src = "/images/level_1.png";
const level2Image = new Image();
level2Image.src = "/images/level_2.png";
const level3Image = new Image();
level3Image.src = "/images/level_3.png";
const level4Image = new Image();
level4Image.src = "/images/level_4.png";
const level5Image = new Image();
level5Image.src = "/images/level_5.png";
const level6Image = new Image();
level6Image.src = "/images/level_6.png";
const level7Image = new Image();
level7Image.src = "/images/level_7.png";
const level8Image = new Image();
level8Image.src = "/images/level_8.png";
const level9Image = new Image();
level9Image.src = "/images/level_9.png";
const level10Image = new Image();
level10Image.src = "/images/level_10.png";

// #endregion

// event listener arrow function
let startGame = (event) => {
  if (gameState === GAME_STATE.STARTSCREEN && event.code === "KeyI") {
    donlimma.currentTime = 0;
    donlimma.play();
    gameState = GAME_STATE.INSTRUCTIONS;
  } else if (gameState === GAME_STATE.INSTRUCTIONS && event.code === "Escape") {
    donlimma.pause();
    gameState = GAME_STATE.STARTSCREEN;
  } else if (gameState === GAME_STATE.RUNNING && isGameOver) {
    if (event.code === "Escape") {
      pauseAllSongs();
      resetAllVariables();
      gameState = GAME_STATE.STARTSCREEN;
    } else if (event.code === "Space") {
      if (!didWin) {
        resetAllVariables();
        gameState = GAME_STATE.RUNNING;
        gameStartAudio.play();
        if (shipNum === 4) {
          oldTownRoad.currentTime = 0;
          oldTownRoad.play();
        } else if (shipNum === 9) {
          rage.currentTime = 0;
          rage.play();
        } else {
          inDaClub.pause();
          gasolina.currentTime = 0;
          gasolina.play();
        }
      }
    }
  } else if (
    gameState === GAME_STATE.STARTSCREEN &&
    (event.code === "Digit1" ||
      event.code === "Digit2" ||
      event.code === "Digit3" ||
      event.code === "Digit5" ||
      event.code === "Digit6" ||
      event.code === "Digit7" ||
      event.code === "Digit9" ||
      event.code === "KeyC")
  ) {
    if (event.code === "Digit1") {
      shipNum = 1;
      isChallenging = false;
      newPlayer(shipNum);
    } else if (event.code === "Digit2") {
      shipNum = 2;
      isChallenging = false;
      newPlayer(shipNum);
    } else if (event.code === "Digit3") {
      shipNum = 3;
      isChallenging = false;
      newPlayer(shipNum);
    } else if (event.code === "Digit5") {
      shipNum = 5;
      isChallenging = false;
      newPlayer(shipNum);
    } else if (event.code === "Digit6") {
      shipNum = 6;
      isChallenging = false;
      newPlayer(shipNum);
    } else if (event.code === "Digit7") {
      shipNum = 7;
      isChallenging = false;
      newPlayer(shipNum);
    } else if (event.code === "Digit9") {
      shipNum = 9;
      isChallenging = false;
      newPlayer(shipNum);
    } else if (event.code === "KeyC") {
      isChallenging = true;
      shipNum = 10;
      newPlayer(shipNum);
    }
    if (isGameOver) {
      resetAllVariables();
    }
    gameState = GAME_STATE.RUNNING;
    gameStartAudio.play();
    if (shipNum === 7) {
      oldTownRoad.currentTime = 0;
      oldTownRoad.play();
    } else if (shipNum === 9) {
      rage.currentTime = 0;
      rage.play();
    } else {
      setLevel();
    }
  } else if (gameState === GAME_STATE.LOSTLIFE) {
    if (event.code === "KeyR") {
      gameState = GAME_STATE.RUNNING;
      setLevel();
    } else if (event.code === "Escape") {
      pauseAllSongs();
      gameState = GAME_STATE.STARTSCREEN;
    }
  }
};

document.addEventListener("keydown", startGame);

// #region Initiate Variables
let playerBulletController = new BulletController(
  canvas,
  "#9df716",
  "player",
  current_level,
  shipNum,
  isDoubleShooter,
  isChallenging
);
let enemyBulletController = new BulletController(
  canvas,
  "red",
  "enemy",
  current_level,
  shipNum,
  false,
  isChallenging
);

let enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController,
  current_level,
  isChallenging
);

let player = new Player(canvas, 18, playerBulletController, shipNum);
// #endregion

// game loop
function game() {
  if (gameState === GAME_STATE.STARTSCREEN) {
    showStartScreenF(
      ctx,
      canvas,
      background,
      hyperionTitle,
      ship1,
      ship2,
      ship3
    );
  } else if (gameState === GAME_STATE.INSTRUCTIONS) {
    // showInstructions(ctx);
    showInstructionsF(ctx, canvas, background, hyperionTitle, ship1, enemy2);
  } else if (gameState === GAME_STATE.LOSTLIFE) {
    displayLostLife();
  } else if (gameState === GAME_STATE.RUNNING) {
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if (!isGameOver) {
      enemyController.draw(ctx);
      player.draw(ctx);
      // shows the Current Level Image, allows bullets to pass over
      drawLevelUp();
      // for ship #9 (middle finger, show images on an interval)
      drawRagePhotos();

      playerBulletController.draw(ctx);
      enemyBulletController.draw(ctx);
    }
  }
}

function newPlayer(shipNum) {
  playerBulletController = new BulletController(
    canvas,
    "#9df716",
    "player",
    current_level,
    shipNum,
    isDoubleShooter,
    isChallenging
  );
  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
    current_level,
    isChallenging
  );
  player = new Player(canvas, 18, playerBulletController, shipNum);
}

function drawRagePhotos() {
  if (shipNum === 9 && rageNum <= 4) {
    if (nextRagePhotoTimer <= 0) {
      nextRagePhotoTimer = 100;
      showRagePhoto = true;
    }
    if (showRagePhoto && ragePhotoTimer > 0) {
      ctx.drawImage(rage_photo, 80, 100, 450, 300);
      ragePhotoTimer--;
    }
    if (showRagePhoto && ragePhotoTimer === 0) {
      showRagePhoto = false;
      ragePhotoTimer = 40;
      if (rageNum === 4) {
        rageNum = 1;
      } else {
        rageNum++;
      }
      rage_photo.src = `/images/rage_${rageNum}.png`;
    } else {
      nextRagePhotoTimer--;
    }
  }
}

function resetAllVariables() {
  current_level = 1;
  isGameOver = false;
  didWin = false;
  isDoubleShooter = false;
  isChallenging = playerBulletController.isChallenging;
  levelUpTextTimer = 40;
  rageNum = 1;
  nextRagePhotoTimer = 100;
  showRagePhoto = false;
  ragePhotoTimer = 40;
  playerLives = 3;
  levelFlashTimer = 15;
  showLevel = true;

  playerBulletController = new BulletController(
    canvas,
    "#9df716",
    "player",
    current_level,
    shipNum,
    isDoubleShooter,
    isChallenging
  );
  enemyBulletController = new BulletController(
    canvas,
    "red",
    "enemy",
    current_level,
    shipNum,
    false,
    isChallenging
  );

  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
    current_level,
    isChallenging
  );
  player = new Player(canvas, 18, playerBulletController, shipNum);

  pauseAllSongs();
}

function pauseAllSongs() {
  gasolina.pause();
  vocalFunction.pause();
  inDaClub.pause();
  dropTop.pause();
  zeze.pause();
  loveScars.pause();
  rosalia.pause();
  aLot.pause();
  spaceCadet.pause();
  dior.pause();
  rage.pause();
  oldTownRoad.pause();
  sexyBack.pause();
  dancingQueen.pause();
  starsOn45.pause();
  boyfriend.pause();
  immaBe.pause();
  hypnotize.pause();
  returnOfTheMack.pause();
}

function setLevel() {
  if (current_level === 1) {
    pauseAllSongs();
    gasolina.currentTime = 0;
    gasolina.play();
  }
  if (current_level === 2) {
    gasolina.pause();
    vocalFunction.currentTime = 0;
    vocalFunction.play();
  } else if (current_level === 3) {
    vocalFunction.pause();
    inDaClub.currentTime = 0;
    inDaClub.play();
  } else if (current_level === 4) {
    inDaClub.pause();
    // dropTop.currentTime = 0;
    // dropTop.play();
    dancingQueen.currentTime = 0;
    dancingQueen.play();
  } else if (current_level === 5) {
    dancingQueen.pause();
    starsOn45.currentTime = 0;
    starsOn45.play();
  } else if (current_level === 6) {
    starsOn45.pause();
    // loveScars
    boyfriend.currentTime = 0;
    boyfriend.play();
  } else if (current_level === 7) {
    boyfriend.pause();
    // rosalia
    immaBe.currentTime = 0;
    immaBe.play();
  } else if (current_level === 8) {
    immaBe.pause();
    // a lot
    sexyBack.currentTime = 0;
    sexyBack.play();
  } else if (current_level === 9) {
    sexyBack.pause();
    // space cadet
    hypnotize.currentTime = 0;
    hypnotize.play();
  } else if (current_level === 10) {
    hypnotize.pause();
    returnOfTheMack.currentTime = 0;
    returnOfTheMack.play();
  }
  levelUp();
}

function levelUp() {
  levelUpTextTimer = 40;
  isDoubleShooter = playerBulletController.isDoubleShooter;
  levelFlashTimer = 15;
  showLevel = true;

  playerBulletController = new BulletController(
    canvas,
    "#9df716",
    "player",
    current_level,
    shipNum,
    isDoubleShooter,
    isChallenging
  );
  enemyBulletController = new BulletController(
    canvas,
    "red",
    "enemy",
    current_level,
    shipNum,
    false,
    isChallenging
  );
  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
    current_level,
    isChallenging
  );
  player = new Player(canvas, 18, playerBulletController, shipNum);

  if (current_level > 1) levelUpSound.play();
}

function drawLevelUp() {
  if (levelUpTextTimer >= 0) {
    if (current_level === 1) {
      ctx.drawImage(level1Image, 210, 300, 186, 48);
    } else if (current_level === 2) {
      ctx.drawImage(level2Image, 210, 300, 186, 48);
    } else if (current_level === 3) {
      ctx.drawImage(level3Image, 210, 300, 186, 48);
    } else if (current_level === 4) {
      ctx.drawImage(level4Image, 210, 300, 186, 48);
    } else if (current_level === 5) {
      ctx.drawImage(level5Image, 210, 300, 186, 48);
    } else if (current_level === 6) {
      ctx.drawImage(level6Image, 210, 300, 186, 48);
    } else if (current_level === 7) {
      levelOnAndOff();
      if (showLevel) {
        ctx.drawImage(level7Image, 210, 300, 186, 48);
      }
    } else if (current_level === 8) {
      ctx.drawImage(level8Image, 210, 300, 186, 48);
    } else if (current_level === 9) {
      levelOnAndOff();
      if (showLevel) {
        ctx.drawImage(level9Image, 210, 300, 186, 48);
      }
    } else if (current_level === 10) {
      ctx.drawImage(level10Image, 210, 300, 186, 48);
    }
    levelUpTextTimer--;
  }
}

function levelOnAndOff() {
  if (levelFlashTimer > 0) {
    levelFlashTimer--;
  } else if (levelFlashTimer === 0) {
    showLevel = !showLevel;
    levelFlashTimer = 1;
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (
    enemyBulletController.collideWith(player) ||
    enemyController.collideWith(player)
  ) {
    if (isChallenging && playerLives > 1) {
      playerLives--;
      gameState = GAME_STATE.LOSTLIFE;
      pauseAllSongs();
    } else {
      if (!isChallenging) pauseAllSongs();
      isGameOver = true;
    }
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
      if (shipNum !== 7 && shipNum !== 9) {
        gasolina.pause();
        vocalFunction.currentTime = 0;
        vocalFunction.play();
      }
      levelUp();
      return;
    } else if (current_level === 2) {
      current_level = 3;
      if (shipNum !== 7 && shipNum !== 9) {
        vocalFunction.pause();
        inDaClub.currentTime = 0;
        inDaClub.play();
      }
      levelUp();
      return;
    } else if (current_level === 3 && !isChallenging) {
      didWin = true;
      isGameOver = true;
      playerWinSound.play();
    }
    // #region challenging levels
    else if (current_level >= 3 && current_level < 10 && isChallenging) {
      current_level++;
      setLevel();
    } else if (current_level === 10 && isChallenging) {
      didWin = true;
      isGameOver = true;
      playerWinSound.play();
    }
    // #endregion
  }
}

function displayGameOver() {
  if (isGameOver) {
    // you won!
    if (didWin) {
      const textOriginX = 50;
      const textOriginY = 125;
      let text = "You Won!";
      ctx.fillStyle = "white";
      ctx.font = "55px Courier New";
      ctx.fillText(text, textOriginX + 120, textOriginY);

      ctx.drawImage(
        hyperionMoon,
        textOriginX + 40,
        textOriginY + 110,
        200,
        172
      );
      const currShip = new Image();
      currShip.src = `/images/pixel_ship_${shipNum}.png`;
      ctx.drawImage(currShip, textOriginX + 350, textOriginY + 260, 53, 53);
      const enemyDeath = new Image();
      enemyDeath.src = "/images/pixel_enemy_death.png";
      ctx.drawImage(enemyDeath, textOriginX + 350, textOriginY + 85, 53, 53);

      let text2 = "Hit ESC to go back to Start Screen";
      ctx.font = "24px Courier New";
      ctx.fillText(text2, textOriginX + 5, textOriginY + 400);

      ctx.fillStyle = "#9df716";
      ctx.fillRect(textOriginX + 372, textOriginY + 170, 3.75, 15);

      // const mittens = new Image();
      // mittens.src = "/images/pixel_ship_6.png";
      // ctx.drawImage(mittens, textOriginX + 150, textOriginY + 70, 53, 53);

      // ctx.font = "15px Courier New";
      // let text3 = "The secret word is: 'Mittens'";
      // ctx.fillText(text3, textOriginX + 210, textOriginY + 60);
    }
    // you lost :(
    else {
      const textOriginX = 100;
      const textOriginY = 100;
      let text = "Game Over!";
      ctx.fillStyle = "white";
      ctx.font = "70px Courier New";
      ctx.fillText(text, textOriginX, textOriginY);

      ctx.drawImage(
        hyperionMoonBurning,
        textOriginX + 80,
        textOriginY + 80,
        250,
        250
      );
      ctx.drawImage(enemy2, textOriginX + 30, textOriginY + 80, 50, 50);
      ctx.drawImage(enemy2, textOriginX + 50, textOriginY + 280, 50, 50);
      ctx.drawImage(enemy2, textOriginX + 340, textOriginY + 230, 50, 50);
      ctx.drawImage(enemy4, textOriginX + 332, textOriginY + 100, 50, 50);
      ctx.drawImage(enemy4, textOriginX + 160, textOriginY + 340, 50, 50);
      ctx.drawImage(enemy4, textOriginX + 20, textOriginY + 180, 50, 50);
      ctx.drawImage(enemy6, textOriginX + 170, textOriginY + 20, 50, 50);
      ctx.drawImage(enemy6, textOriginX + 280, textOriginY + 330, 50, 50);

      let text2 = "Press Space Bar to Restart";
      ctx.font = "bold 24px Courier New";
      ctx.fillText(text2, textOriginX + 20, textOriginY + 445);

      ctx.font = "16px Courier New";
      let text3 = "or hit ESC to choose new ship.";
      ctx.fillText(text3, textOriginX + 60, textOriginY + 485);
    }
  }
}

function displayLostLife() {
  const textOriginX = 80;
  const textOriginY = 250;

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(hyperionTitle, 150, 30, 300, 120);

  let text = "You Lost A Life!";
  ctx.fillStyle = "white";
  ctx.font = "45px Courier New";
  ctx.fillText(text, textOriginX, textOriginY);

  let text2 = "Press R to continue";
  ctx.font = "bold 25px Courier New";
  ctx.fillText(text2, textOriginX + 60, textOriginY + 90);

  let text3 = `You have ${playerLives} more live(s):`;
  ctx.font = "25px Courier New";
  ctx.fillText(text3, textOriginX + 50, textOriginY + 185);

  const currShip = new Image();
  currShip.src = `/images/pixel_ship_${shipNum}.png`;

  if (playerLives === 2) {
    ctx.drawImage(currShip, textOriginX + 80, textOriginY + 240, 70, 70);
    ctx.drawImage(currShip, textOriginX + 270, textOriginY + 240, 70, 70);
  } else if (playerLives === 1) {
    ctx.drawImage(currShip, textOriginX + 180, textOriginY + 240, 70, 70);
  }
}

setInterval(game, 1000 / 20);
