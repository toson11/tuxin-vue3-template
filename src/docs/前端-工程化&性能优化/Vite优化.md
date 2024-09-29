# 打包分析

[rollup-plugin-visualizer]([https://github.com/btd/rollup-plugin-visualizer](vscode-file://vscode-app/Applications/Visual%20Studio%20Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html "https://github.com/btd/rollup-plugin-visualizer"))

# 在网页用编辑器打开源码

按下Command(⌘)+Shift(⇧)，然后点击页面元素会自动打开本地IDE并跳转到对应的代码位置
[vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector#readme)

# 资源分类输出

```ts
build.rollupOptions.output = {
  chunkFileNames: "static/js/[name]-[hash].js",
  entryFileNames: "static/js/[name]-[hash].js",
  assetFileNames: "static/[ext]/[name]-[hash].[ext]"
};
```

# 依赖预构建

##### 特点

- Vite 会将预构建的依赖缓存到 `node_modules/.vite`，如果想去掉缓存删除该文件即可
- 预构建通过esbuild执行，非常快

##### 作用

1. **减少开发阶段依赖请求数量**：将依赖的多个导出模块转换为一个模块，减少开发阶段网络请求：比如`lodash-es`有几百个模块，开发阶段vite会发送几百个请求，造成网络阻塞
2. **CommonJS 和 UMD 兼容性**：将cj或umd的库转换为es模块

##### 使用

```ts
optimizeDeps = {
  // 如果依赖项很大（包含很多内部模块）或者是 CommonJS，添加到include
  include: [],
  // 如果依赖项很小，并且已经是有效的 ESM，添加到exclude
  exclude: []
};
```
