import type { App } from "vue";

const baseComponents = import.meta.glob(`/src/components/base/*.{vue,tsx}`, {
  eager: true
});
const basePluginComponents = import.meta.glob(
  `/src/components/base/**/index.ts`,
  {
    eager: true
  }
);
// 全局注册@iconify/vue图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "@/components/ReIcon";

/**
 * 注册全局插件
 */
export function useGlobalComponents(app: App) {
  app.component("IconifyIconOffline", IconifyIconOffline);
  app.component("IconifyIconOnline", IconifyIconOnline);
  app.component("FontIcon", FontIcon);
  Object.keys(baseComponents).forEach(path => {
    const componentName = path
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "");
    app.component(componentName, (baseComponents[path] as any).default);
  });
  Object.keys(basePluginComponents).forEach(path => {
    const componentName = path
      .split("/")
      .slice(-2)[0]
      ?.replace(/\.\w+$/, "");
    app.component(componentName, (basePluginComponents[path] as any).default);
  });
}
