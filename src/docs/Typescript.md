# 组件属性定义推荐interface

- interface可以合并同名类型，这样就可以通过全局的declare module语句扩展组件属性

# 可变参数类型的函数

##### 普通函数

```ts
function greet(name: string): string;
function greet(age: number): string;
function greet(value: any): string {
  if (typeof value === "string") {
    return `你好，${value}`;
  } else if (typeof value === "number") {
    return `你今年 ${value} 岁了`;
  }
}
```

##### 箭头函数

```ts
type GreetFunction = {
  (name: string): string;
  (age: number): string;
};

const greet: GreetFunction = (value: any): string => {
  if (typeof value === "string") {
    return `你好，${value}`;
  } else if (typeof value === "number") {
    return `你今年 ${value} 岁了。`;
  }
  return "";
};
```
