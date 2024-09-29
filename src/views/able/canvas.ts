/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-29 18:56:59
 * @FilePath: /tuxin-vue3-template/src/views/able/canvas.ts
 * @Description: 头部注释
 */
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

export class Rect {
  dpr: number;
  public startX: number;
  public startY: number;
  public endX: number;
  public endY: number;
  public color: string;
  public minWidth: number;
  public minHeight: number;
  constructor({
    startX,
    startY,
    endX,
    endY,
    color = "red",
    minWidth = 10,
    minHeight = 10
  }: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color?: string;
    minWidth?: number;
    minHeight?: number;
  }) {
    this.dpr = window.devicePixelRatio || 1;
    this.startX = startX * this.dpr;
    this.startY = startY * this.dpr;
    this.endX = endX * this.dpr;
    this.endY = endY * this.dpr;
    this.color = color;
    this.minWidth = minWidth * this.dpr;
    this.minHeight = minHeight * this.dpr;
  }

  get minX() {
    return this.startX < this.endX ? this.startX : this.endX;
  }

  get maxX() {
    return this.startX > this.endX ? this.startX : this.endX;
  }

  get minY() {
    return this.startY < this.endY ? this.startY : this.endY;
  }

  get maxY() {
    return this.startY > this.endY ? this.startY : this.endY;
  }

  isOverlap(e: MouseEvent) {
    const mouseX = e.offsetX * this.dpr,
      mouseY = e.offsetY * this.dpr;
    return (
      mouseX >= this.minX &&
      mouseX <= this.maxX &&
      mouseY >= this.minY &&
      mouseY <= this.maxY
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    const width = this.maxX - this.minX,
      height = this.maxY - this.minY,
      startX =
        this.startX > this.endX && width < this.minWidth
          ? this.startX - this.minWidth
          : this.minX,
      startY =
        this.startY > this.endY && height < this.minHeight
          ? this.startY - this.minHeight
          : this.minY;
    ctx.fillRect(
      startX,
      startY,
      // 限制最小宽高
      width > this.minWidth ? width : this.minWidth,
      height > this.minHeight ? height : this.minHeight
    );
    // 添加文案
    const text = `x: ${this.minX}px
    y: ${this.minY}px
    w" ${this.maxX - this.minX}px
    h: ${this.maxY - this.minY}px`;
    ctx.fillText(text, this.minX, this.minY - 10);
  }
}
