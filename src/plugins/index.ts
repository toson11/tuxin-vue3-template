/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-27 15:43:03
 * @FilePath: /tuxin-vue3-template/src/plugins/index.ts
 * @Description: 注册全局插件
 */
import type { App } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import { useI18n } from "./i18n";
import { useElementPlus } from "./elementPlus";
import { useVxeTable } from "./vxeTable";
import Table from "@pureadmin/table";
import PureDescriptions from "@pureadmin/descriptions";
import { useEcharts } from "./echarts";
import { useGlobalComponents } from "./globalComponent";

function initPlugins(app: App) {
  app
    .use(MotionPlugin)
    .use(useI18n)
    .use(useElementPlus)
    .use(useGlobalComponents)
    .use(Table)
    .use(useVxeTable)
    .use(PureDescriptions)
    .use(useEcharts);
}

export default initPlugins;
