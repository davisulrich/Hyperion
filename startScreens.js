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
  // ctx.drawImage(hyperionTitle, 30, 30, 550, 260);
  ctx.drawImage(hyperionTitle, 50, 90, 500, 165);

  const textOriginX = 100;
  const textOriginY = 350;

  ctx.drawImage(ship1, textOriginX - 5, textOriginY + 130, 75, 75);
  ctx.drawImage(ship2, textOriginX + 165, textOriginY + 130, 75, 75);
  ctx.drawImage(ship3, textOriginX + 330, textOriginY + 130, 75, 75);

  ctx.fillStyle = "white";

  ctx.font = "24px Silkscreen";
  const text1 = "By Davis Ulrich";
  ctx.fillStyle = "#7d7d7d";
  ctx.fillText(text1, textOriginX + 80, textOriginY - 30);

  ctx.fillStyle = "white";
  ctx.font = "20px Silkscreen";
  const text4 = "Challenge Edition-'C'  Instructions-'I'";
  ctx.fillText(text4, textOriginX - 48, textOriginY + 40);

  ctx.font = "18px Silkscreen";
  const text5 = "Press 1:";
  ctx.fillText(text5, textOriginX - 15, textOriginY + 110);
  const text6 = "Press 2:";
  ctx.fillText(text6, textOriginX + 155, textOriginY + 110);
  const text7 = "Press 3:";
  ctx.fillText(text7, textOriginX + 320, textOriginY + 110);

  ctx.fillStyle = "#7d7d7d";
  ctx.font = "16px Silkscreen";
  const text8 = '"Starship"';
  ctx.fillText(text8, textOriginX - 20, textOriginY + 235);
  const text9 = '"Frog-Zap"';
  ctx.fillText(text9, textOriginX + 150, textOriginY + 235);
  const text10 = '"Houdini"';
  ctx.fillText(text10, textOriginX + 325, textOriginY + 235);
}

export default showStartScreenF;
