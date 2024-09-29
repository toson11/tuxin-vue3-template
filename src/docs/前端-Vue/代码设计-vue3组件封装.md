# vue3组件封装设计

## 组件特性

- 属性
- 插槽
- 事件
- 方法

## 组件继承

```js
import { ElInput } from "element-plus";
import { merge } from "lodash";

app.component(
  "ElInput",
  merge(ElInput, {
    props: {
      placeholder: {
        default: "请输入"
      }
    }
  })
);
```

## 插槽透传

jsx语法更方便

```jsx
<script lang="jsx">
export default {
  render() {
    const areaA = (
        <div>
          区域A这里有一个组件，这个组件需要替换插槽
          <el-tree data={treeData}>
            {{
              default: this.$slots.tree
            }}
          </el-tree>
        </div>
    );

    const areaB = (
        <div>
          区域B这里有一个组件，这个组件需要替换插槽
          <el-table data={tableData}>
            {{
              default: this.$slots.default
            }}
          </el-table>
        </div>
    );

    return (
        <div>
          {areaA}
          {areaB}
        </div>
    );
  }
}
</script>
```

## 事件和属性透传$attrs

vue3中，`$listenrs` 和 `$attrs` 都被合并到了 `$attrs` 中。
vue3中，组件接收的所有属性和事件会默认透传给组件的根元素，但是可以通过 `inheritAttrs: false` 来关闭默认透传。

## 调用子组件方法

```vue
<template>
  <div>
    <el-input ref="input" />
  </div>
</template>

<script>
export default {
  mounted() {
    // 不建议，维护性差
    Object.values(this.$refs.input).forEach(value => {
      if (typeof value === "function") {
        this[value.name] = (...args) => value(...args);
      }
    });
  },
  methods: {
    // 给外部调用
    inputRef() {
      return this.$refs.input;
    }
  }
};
</script>
```
