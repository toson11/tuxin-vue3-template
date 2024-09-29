import { onMounted, type Ref, ref } from "vue";

/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-29 18:46:48
 * @FilePath: /tuxin-vue3-template/src/views/able/useCanvas.ts
 * @Description: 头部注释
 */
export const useCanvas = (canvasRef: Ref<HTMLCanvasElement | null>) => {
  const ctx = ref<CanvasRenderingContext2D | null>(null);
  const containerRef = ref<HTMLElement | null>(null);

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
    containerRef.value = canvasRef.value.parentElement;
    resizeCanvas();
  });

  return {
    canvasCtx: ctx,
    canvasContainer: containerRef,
    resizeCanvas
  };
};
