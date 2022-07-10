function showInstructionsF(
  ctx,
  canvas,
  background,
  hyperionTitle,
  ship1,
  enemy2
) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(hyperionTitle, 150, 30, 300, 120);

  const textOriginX = 50;
  const textOriginY = 210;
  ctx.fillStyle = "#adadad";
  ctx.font = "bold 36px Courier New";
  const text1 = "INSTRUCTIONS:";
  ctx.fillText(text1, textOriginX + 110, textOriginY);

  ctx.font = "24px Courier New";
  const text2 = "You must shoot the aliens who";
  ctx.fillText(text2, textOriginX, textOriginY + 60);
  const text3 = "are attempting to destroy";
  ctx.fillText(text3, textOriginX, textOriginY + 105);
  const text4 = "Saturn's Moon, Hyperion.";
  ctx.fillText(text4, textOriginX, textOriginY + 150);
  const text5 = "You have one life.";
  ctx.fillText(text5, textOriginX, textOriginY + 205);

  ctx.font = "bold 24px Courier New";
  const text5a = "Press ESC to go back.";
  ctx.fillText(text5a, textOriginX, textOriginY + 260);

  ctx.fillRect(80, textOriginY + 320, 280, 40);
  ctx.fillRect(420, textOriginY + 320, 50, 40);
  ctx.fillRect(500, textOriginY + 320, 50, 40);

  ctx.font = "20px Courier New";
  const text6 = "TO SHOOT:";
  ctx.fillText(text6, textOriginX + 110, textOriginY + 310);
  const text7 = "TO MOVE:";
  ctx.fillText(text7, textOriginX + 385, textOriginY + 310);

  ctx.fillStyle = "black";
  const text8 = "SPACEBAR";
  ctx.fillText(text8, textOriginX + 115, textOriginY + 345);
  const text9 = "<";
  ctx.fillText(text9, textOriginX + 390, textOriginY + 345);
  const text10 = ">";
  ctx.fillText(text10, textOriginX + 470, textOriginY + 345);

  ctx.fillStyle = "#9df716";
  ctx.drawImage(ship1, 490, 400, 53, 53);
  ctx.fillRect(514, 300, 3.75, 15);
  ctx.drawImage(enemy2, 490, 150, 50, 50);
}

export default showInstructionsF;
