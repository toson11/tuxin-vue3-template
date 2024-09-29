<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { getGridCanvas, Rect } from "./canvas";
import { useCanvas } from "./useCanvas";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLElement | null>(null);
const bgCanvas = ref<HTMLCanvasElement>(null);
const items = ref([]);
const currentIndex = ref<number>(-1);
const moveStartXY = ref<{ x: number; y: number } | null>(null);

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.drawImage(bgCanvas.value, 0, 0);
}

const { canvasCtx, resizeCanvas, canvasContainer } = useCanvas(canvasRef);

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
    moveStartXY.value = null;
    currentIndex.value = len;
    for (let i = 0; i < len; i++) {
      const item = items.value[i];
      if (item.isOverlap(e)) {
        currentIndex.value = i;
        moveStartXY.value = { x: e.offsetX, y: e.offsetY };
        break;
      }
    }
    const rect = canvas.getBoundingClientRect();
    if (!moveStartXY.value) {
      items.value.push(
        new Rect({
          startX: e.offsetX,
          startY: e.offsetY,
          endX: 0,
          endY: 0
        })
      );
    }
    const stopMousemoveListener = useEventListener(canvas, "mousemove", e => {
      console.log("🚀 ~ stopMousemoveListener ~ e:", e);
      if (currentIndex.value === -1) return;
      const currentItem = items.value[currentIndex.value];
      if (!currentItem) return;
      // 如果当前有选中的矩形，则更新其尺寸
      if (moveStartXY.value) {
        const diffX = e.offsetX - moveStartXY.value.x;
        const diffY = e.offsetY - moveStartXY.value.y;
        currentItem.startX += diffX;
        currentItem.startY += diffY;
        currentItem.endX += diffX;
        currentItem.endY += diffY;
        moveStartXY.value = { x: e.offsetX, y: e.offsetY };
      } else {
        currentItem.endX = e.offsetX;
        currentItem.endY = e.offsetY;
      }
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx);
        for (const item of items.value) {
          item.draw(ctx, canvasRef.value);
        }
      }
    });
    const stopMouseupListener = useEventListener(canvas, "mouseup", e => {
      currentIndex.value = -1;
      moveStartXY.value = null;
      stopMousemoveListener();
      stopMouseupListener();
    });
  });
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
