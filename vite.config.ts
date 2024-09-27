/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-27 11:28:19
 * @FilePath: /tuxin-vue3-template/vite.config.ts
 * @Description: 头部注释
 */
import { getPlugins } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { type UserConfigExport, type ConfigEnv, loadEnv } from "vite";
import { pathResolve, __APP_INFO__ } from "./build/utils";
import buildConfig from "./build/config";

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_COMPRESSION, VITE_PUBLIC_PATH } = loadEnv(
    mode,
    buildConfig.root
  ) as unknown as ViteEnv;
  return {
    base: VITE_PUBLIC_PATH || "/",
    root: buildConfig.root,
    resolve: {
      alias: buildConfig.alias
    },
    // 服务端渲染
    server: {
      // 端口号
      port: buildConfig.port,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {},
      // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    plugins: getPlugins(VITE_CDN, VITE_COMPRESSION),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            '@use "sass:math";',
            '@import "@/style/theme.scss";'
          ].join(" "),
          charset: false
        }
      }
    },
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      target: "es2015",
      sourcemap: false,
      // chunk包超出指定大小时警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("./index.html", import.meta.url)
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    define: {
      // 控制 vue-i18n 插件在生产环境下是否启用国际化的开发工具
      __INTLIFY_PROD_DEVTOOLS__: false,
      // 应用信息
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
