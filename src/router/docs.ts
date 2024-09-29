/*
 * @Author: longtuxin
 * @LastEditors: longtuxin
 * @LastEditTime: 2024-09-29 16:12:18
 * @FilePath: /tuxin-vue3-template/src/router/docs.ts
 * @Description: 头部注释
 */
import type { RouteRecordRaw } from "vue-router";

const docs = import.meta.glob("@/docs/**/*.md");

const docsRoutes: Array<RouteRecordRaw> = [
  {
    path: "/docs",
    name: "docs",
    component: () => import("@/layout/layout-main.vue"),
    meta: {
      title: "首页"
    },
    children: [
      {
        path: "/docs/",
        name: "docs-index",
        component: () => import("@/docs/index.vue"),
        meta: {
          title: "首页"
        }
      }
    ]
  }
];
for (const path in docs) {
  const filepath = path.replace(/(.*\/)docs\/(.*)\.md/, "$2");
  const dirs = filepath.split("/");
  const rootDirname = dirs[0];
  const filename = dirs.pop();
  let routeIndex = docsRoutes.findIndex(
    route => route.path === "/docs/" + rootDirname
  );
  if (routeIndex === -1) {
    docsRoutes.push({
      path: "/docs/" + rootDirname,
      name: rootDirname,
      component: () => import("@/layout/layout-main.vue"),
      meta: {
        title: rootDirname
      }
    });
    routeIndex = docsRoutes.length - 1;
  }
  docsRoutes[routeIndex].children = docsRoutes[routeIndex].children || [];
  docsRoutes[routeIndex].children.push({
    path: `/docs/${filepath}`,
    name: rootDirname === filename ? `${rootDirname}-${filename}` : filename,
    component: docs[path],
    meta: {
      title: filename
    }
  });
}

export default docsRoutes;
