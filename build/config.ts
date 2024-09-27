/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-27 10:51:13
 * @FilePath: /tuxin-vue3-template/build/config.ts
 * @Description: 头部注释
 */
import { pathResolve } from "./utils";

export default {
  /** 启动`node`进程时所在工作目录的绝对路径 */
  root: process.cwd(),
  port: 9527,
  alias: {
    "@": pathResolve("../src"),
    "@build": pathResolve()
  }
};
