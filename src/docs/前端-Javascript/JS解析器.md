---
tags:
  - javascript原理
---

# JS解析器

## 什么是解析器

解析器是运行时的语言求值器，它将源代码转换成抽象语法树（AST），遍历并逐个计算它们。

源代码 -> 词法解析器 -> 词法单元Token -> 语法解析器 -> 抽象语法树 -> 遍历 -> 执行

## 词法分析 Tokenization

> 将源代码分解并组织成一组有意义的单词。词法分析器扫描代码，提取有意义的词法单元

```js
var a = 1;
// 词法分析后得到
[
  ('var': 'keyword'), // 关键词
  ('a': 'identifier'), // 标识符
  ('=': 'assignment'), // 赋值
  ('1': 'literal'), // 字面量
  (';': 'separator') // 分隔符
]
```

## 语法分析 Parsing

> 将词法分析生成的 Token 转换成抽象语法树Abstract Syntax Tree

语法规则：

- 主语Subject
- 谓语Predicate
- 宾语Object

token 根据语法规则转成AST

```json
{
  "type": "Program", // 程序/根节点
  "body": [
    {
      "type": "VariableDeclaration", // 根据语法规则，得出这是一个声明语法
      "declarations": [
        {
          "type": "VariableDeclarator", // 变量声明
          "id": {
            "type": "Identifier", // 标识符
            "name": "a" // 变量名
          },
          "init": {
            "type": "Literal", // 字面量
            "value": 1, // 值
            "raw": "1" // 原始值
          }
        }
      ],
      "kind": "var" // 变量类型
    }
  ]
}
```

## 遍历AST Traversing

> 遍历AST，执行每个节点，计算其值

```js
function traverse(node, callback) {
  callback(node);

  for (let key in node) {
    if (node.hasOwnProperty(key)) {
      let child = node[key];
      if (typeof child === "object" && child !== null) {
        if (Array.isArray(child)) {
          child.forEach(n => traverse(n, callback));
        } else {
          traverse(child, callback);
        }
      }
    }
  }
}

traverse(ast, node => {
  console.log(node.type);
});
```
