export function getGridCanvas(
  ctx,
  {
    gridSpacing = 20,
    canvasWidth = ctx.canvas.width,
    canvasHeight = ctx.canvas.height
  } = {}
) {
  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");
  offscreenCanvas.width = canvasWidth;
  offscreenCanvas.height = canvasHeight;
  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height); // 清除画布

  offscreenCtx.fillStyle = "rgba(0, 0, 0, 0.5)"; // 网格点的颜色
  offscreenCtx.strokeStyle = "rgba(0, 0, 0, 0.1)"; // 网格线的颜色
  offscreenCtx.lineWidth = 0.5; // 网格线的宽度

  // 绘制垂直线
  for (let x = 0; x <= offscreenCanvas.width; x += gridSpacing) {
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(x, 0);
    offscreenCtx.lineTo(x, offscreenCanvas.height);
    offscreenCtx.stroke();
  }

  // 绘制水平线
  for (let y = 0; y <= offscreenCanvas.height; y += gridSpacing) {
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(0, y);
    offscreenCtx.lineTo(offscreenCanvas.width, y);
    offscreenCtx.stroke();
  }

  // 绘制网格点
  for (let x = 0; x <= offscreenCanvas.width; x += gridSpacing) {
    for (let y = 0; y <= offscreenCanvas.height; y += gridSpacing) {
      offscreenCtx.beginPath();
      offscreenCtx.arc(x, y, 2, 0, Math.PI * 2); // 网格点的半径
      offscreenCtx.fill();
    }
  }
  return offscreenCanvas;
}
