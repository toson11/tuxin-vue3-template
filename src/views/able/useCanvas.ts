import { onMounted, ref } from "vue";

/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-27 18:40:24
 * @FilePath: /tuxin-vue3-template/src/views/able/useCanvas.ts
 * @Description: 头部注释
 */
export const useCanvas = (containerRef, canvasRef) => {
  const ctx = ref<CanvasRenderingContext2D | null>(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.value;
    const container = containerRef.value;
    if (container && canvas) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
  };

  onMounted(() => {
    ctx.value = canvasRef.value.getContext("2d");
    resizeCanvas();
  });

  return { ctx, resizeCanvas };
};
