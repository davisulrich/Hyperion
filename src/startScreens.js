function showStartScreenF(
  ctx,
  canvas,
  background,
  hyperionTitle,
  ship1,
  ship2,
  ship3
) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(hyperionTitle, 30, 30, 550, 260);

  const textOriginX = 100;
  const textOriginY = 350;

  ctx.drawImage(ship1, textOriginX - 5, textOriginY + 130, 75, 75);
  ctx.drawImage(ship2, textOriginX + 165, textOriginY + 130, 75, 75);
  ctx.drawImage(ship3, textOriginX + 330, textOriginY + 130, 75, 75);

  ctx.fillStyle = "white";

  ctx.font = "22px Courier New";
  const text1 = "For instructions, hit 'I' key.";
  ctx.fillText(text1, textOriginX, textOriginY);

  ctx.font = "bold 22px Courier New";
  const text4 = "Press 1-3 to start.";
  ctx.fillText(text4, textOriginX + 75, textOriginY + 50);

  ctx.font = "20px Courier New";
  const text5 = "Press 1:";
  ctx.fillText(text5, textOriginX - 15, textOriginY + 110);
  const text6 = "Press 2:";
  ctx.fillText(text6, textOriginX + 155, textOriginY + 110);
  const text7 = "Press 3:";
  ctx.fillText(text7, textOriginX + 320, textOriginY + 110);

  ctx.font = "17px Courier New";
  const text8 = '"Starship"';
  ctx.fillText(text8, textOriginX - 20, textOriginY + 235);
  const text9 = '"Frog-Zap"';
  ctx.fillText(text9, textOriginX + 155, textOriginY + 235);
  const text10 = '"Houdini"';
  ctx.fillText(text10, textOriginX + 325, textOriginY + 235);
}

export default showStartScreenF;
