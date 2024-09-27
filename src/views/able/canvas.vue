<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { getGridCanvas } from "./canvas";
import { useCanvas } from "./useCanvas";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLElement | null>(null);
const bgCanvas = ref<HTMLCanvasElement>(null);
const items = ref([]);
const currentIndex = ref<number>(-1);
const startXY = ref<{ x: number; y: number } | null>(null);

class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get minX() {
    return this.x;
  }

  get maxX() {
    return this.x + this.width;
  }

  get minY() {
    return this.y;
  }

  get maxY() {
    return this.y + this.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.drawImage(bgCanvas.value, 0, 0);
}

const { ctx: canvasCtx, resizeCanvas } = useCanvas(
  canvasContainerRef,
  canvasRef
);

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvasCtx.value;
  if (!canvas) return;
  resizeCanvas();
  bgCanvas.value = getGridCanvas(ctx);
  drawGrid(ctx);
  useEventListener(canvas, "mousedown", e => {
    // 如果点中了一个矩形，则更新该矩形
    const len = items.value.length;
    for (let i = 0; i < len; i++) {
      const item = items.value[i];
      if (
        e.offsetX >= item.minX &&
        e.offsetX <= item.maxX &&
        e.offsetY >= item.minY &&
        e.offsetY <= item.maxY
      ) {
        currentIndex.value = i;
        console.log("🚀 ~ onMounted ~ currentIndex.value:", currentIndex.value);
        startXY.value = { x: e.offsetX, y: e.offsetY };
        console.log("🚀 ~ onMounted ~ startXY.value:", startXY.value);
        return;
      }
    }
    startXY.value = null;
    currentIndex.value = len;
    items.value.push(new Rect(e.offsetX, e.offsetY, 0, 0));
  });
  useEventListener(canvas, "mousemove", e => {
    if (currentIndex.value < 0) return;
    const currentItem = items.value[currentIndex.value];
    if (!currentItem) return;
    // 如果当前有选中的矩形，则更新其尺寸
    if (startXY.value) {
      currentItem.x += e.offsetX - startXY.value.x;
      currentItem.y += e.offsetY - startXY.value.y;
      startXY.value = { x: e.offsetX, y: e.offsetY };
    } else {
      currentItem.width = e.offsetX - currentItem.x;
      currentItem.height = e.offsetY - currentItem.y;
    }
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx);
      for (const item of items.value) {
        item.draw(ctx);
      }
    }
  });
  useEventListener(canvas, "mouseup", e => {
    console.log(e);
    currentIndex.value = -1;
    startXY.value = null;
  });
  // useEventListener(canvas, "mouseenter", () => {});
  // useEventListener(canvas, "mouseleave", () => {});
});
</script>

<template>
  <BasePageContent card-padding="0">
    <div ref="canvasContainerRef" class="w-full h-full">
      <canvas ref="canvasRef" class="w-full h-full" />
    </div>
  </BasePageContent>
</template>

<!-- <style lang="scss" scoped></style> -->
