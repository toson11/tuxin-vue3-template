/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-29 11:13:34
 * @FilePath: /tuxin-vue3-template/build/plugins.ts
 * @Description: 头部注释
 */
import { cdn } from "./cdn";
import vue from "@vitejs/plugin-vue";
import { pathResolve } from "./utils";
import svgLoader from "vite-svg-loader";
import type { PluginOption } from "vite";
import checker from "vite-plugin-checker";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Inspector from "vite-plugin-vue-inspector";
import { configCompressPlugin } from "./compress";
import removeNoMatch from "vite-plugin-router-warn";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
// import { themePreprocessorPlugin } from "@pureadmin/theme";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
// import { genScssMultipleScopeVars } from "../src/layout/theme";
import { vitePluginFakeServer } from "vite-plugin-fake-server";
import { createHtmlPlugin } from "vite-plugin-html";
import Markdown from "vite-plugin-md";
import pkg from "../package.json";

export function getPlugins(
  VITE_CDN: ViteEnv["VITE_CDN"],
  VITE_COMPRESSION: ViteCompression
): PluginOption[] {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    createHtmlPlugin({
      inject: {
        data: {
          title: pkg.name
        }
      }
    }),
    Markdown(),
    vue({
      include: [/\.vue$/, /\.md$/] // 支持 .vue 和 .md 文件
    }),
    // jsx、tsx语法支持
    vueJsx(),
    VueI18nPlugin({
      include: [pathResolve("../locales/**")]
    }),
    checker({
      typescript: true,
      vueTsc: true,
      eslint: {
        lintCommand: `eslint ${pathResolve("../{src,mock,build}/**/*.{vue,js,ts,tsx}")}`,
        useFlatConfig: true
      },
      terminal: false,
      enableBuild: false
    }),
    // 按下Command(⌘)+Shift(⇧)，然后点击页面元素会自动打开本地IDE并跳转到对应的代码位置
    Inspector(),
    /**
     * 开发环境下移除非必要的vue-router动态路由警告No match found for location with path
     * 非必要具体看 https://github.com/vuejs/router/issues/521 和 https://github.com/vuejs/router/issues/359
     * vite-plugin-router-warn只在开发环境下启用，只处理vue-router文件并且只在服务启动或重启时运行一次，性能消耗可忽略不计
     */
    removeNoMatch(),
    // mock支持
    vitePluginFakeServer({
      logger: false,
      include: "mock",
      infixName: false,
      enableProd: true
    }),
    // 自定义主题
    // themePreprocessorPlugin({
    //   scss: {
    //     multipleScopeVars: genScssMultipleScopeVars(),
    //     extract: true
    //   }
    // }),
    // svg组件化支持
    svgLoader(),
    VITE_CDN === "true" ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : (null as any)
  ];
}
