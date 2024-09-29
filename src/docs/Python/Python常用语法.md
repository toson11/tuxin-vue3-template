# Python常用语法

## 值的类型

- **int**：整数，如1, 2, 3
- **float**：浮点数，如1.0, 2.0, 3.0
- **bool**：布尔值，如True, False
- **str**：字符串，如"hello", "world"
- **tuple**：元组，如("a", "b", "c")
- **frozenset**：不可变集合，如frozenset([1, 2, 3])
- **list**：列表，如[1, 2, 3]
- **dict**：字典，如{"a": 1, "b": 2, "c": 3}
- **set**：集合，如{1, 2, 3}
- **None**：空值
- ...

## 值的方法

### 创建值

int(), float(), str(), bool()
dict(), set(), tuple()
list(), frozenset()

### Dict

- **dict.get(key, default=None)**：获取键值，如dict.get("a", 1)
- **dict.items()**：获取所有键值对，如dict.items()
- **dict.keys()**：获取所有键，如dict.keys()
- **dict.values()**：获取所有值，如dict.values()
- **dict.update(other)**：更新字典，如dict.update({"a": 1, "b": 2, "c": 3})
- **dict.pop(key, default=None)**：删除键值对，如dict.pop("a", 1)
- **dict.clear()**：清空字典，如dict.clear()
- **dict.setdefault(key, default=None)**：设置默认值，如dict.setdefault("a", 1)，如果key存在则不修改，不存在则添加
- ...

### List

- **list.append(item)**：添加元素，如list.append(1)
- **list.extend(iterable)**：添加多个元素，如list.extend([1, 2, 3])
- **list.insert(index, item)**：在指定位置插入元素，如list.insert(0, 1)
- **list.remove(item)**：删除元素，如list.remove(1)
- **list.pop(index=None)**：删除元素，如list.pop(0)
- **list.clear()**：清空列表，如list.clear()
- **list[index]**：获取元素，如list[0]
- **list[start:end]**：切片，如list[0:1]，可省略start和end，如list[:1]或list[1:]
- **list[start:end:step]**：切片，如list[0:1:2]
- **list.index(item, start=None, stop=None)**：查找元素位置，如list.index(1, 0, 1)
- **list.count(item)**：计算元素出现次数，如list.count(1)
- **list.sort(key=None, reverse=False)**：排序，如list.sort(key=lambda x: x[1], reverse=True)
- **list.reverse()**：反转，如list.reverse()
- ...

### String

- **str.split(sep=None, maxsplit=-1)**：分割字符串，如str.split("a", 1)
- **str.join(iterable)**：连接字符串，如str.join(["a", "b", "c"])
- **str.replace(old, new, count=None)**：替换字符串，如str.replace("a", "b", 1)
- **str.strip([chars])**：去除字符串两端的字符，如str.strip("a")
- **str.format(...args)**：格式化字符串
  - 基本用法：`"我叫{}, 今年{}岁".format("张三", 18)`
  - 关键字参数：`"我叫{name}, 今年{age}岁".format(name="张三", age=18)`
  - 索引参数：`"我叫{0}, 今年{1}岁".format("张三", 18)`
  - 格式化数字：`"{:.2f}".format(1.23456)`，输出`1.23`
  - 格式化时间：`"{:%Y-%m-%d %H:%M:%S}".format(time.localtime())`，输出`2024-02-20 18:00:00`
  - 格式化百分比：`"{:.2%}".format(0.123456)`，输出`12.35%`
  - 对齐字符串：
    - `"{:<10}".format("左对齐")`，输出`左对齐    `
    - `"{:>10}".format("右对齐")`，输出`    右对齐`
    - `"{:*^10}".format("居中")`，输出`   居中   `
  - 填充字符：`"{:*^10}".format("居中")`，输出`***居中***`
  - 访问对象属性：
    - 关键字：`"{obj.attr}".format(obj=obj)`
    - 索引：`"{0.name} {0.age}".format(obj)`
    - ...
  - 以上方法更推荐使用f-string，如`f"我叫{name}, 今年{age}岁"`，`f"{time:%Y-%m-%d %H:%M:%S}{percent:.2%}"`
- ...

### Tuple

- **tuple.count(item)**：计算元素出现次数，如tuple.count(1)
- **tuple.index(item, start=None, stop=None)**：查找元素位置，如tuple.index(1, 0, 1)
- ...

### Set

- **set.add(item)**：添加元素，如set.add(1)
- **set.remove(item)**：删除元素，如set.remove(1)
- **set.clear()**：清空集合，如set.clear()
- ...

## 系统内置方法

- **print()**：打印输出
- **len()**：获取长度
- **type()**：获取类型
- **id()**：获取唯一标识
- **isinstance(value, type)**：判断类型，如isinstance(1, int)
- **issubclass(model, db.Model)**：判断model是否继承自db.Model
- **getattr(obj, attr, default=None)**：获取对象属性
- **setattr(obj, attr, value)**：设置对象属性
- **hasattr(obj, attr)**：判断对象是否有该属性
- **delattr(obj, attr)**：删除对象属性
- **open(file, mode='r')**：打开文件
- ...

## 常用语法

- **for item in iterable**：遍历可迭代对象
- **if condition**：条件判断
- **while condition**：循环
- **try...except...finally**：异常处理
- **with...as...**：上下文管理，如with open("file.txt", "r") as file:，确保文件在使用后正确关闭
- **map(function, iterable)**：映射
- **filter(function, iterable)**：过滤
- **raise Exception(message)**：抛出异常

## 类

- **class**：定义类
- **继承**：`class ChildClass(ParentClass)`
- ****init****：初始化方法
- **self**：类实例
- **super()**：调用父类方法

## 使用class和字典维护配置的区别

- 类方法更适合大型、复杂的项目，特别是当配置项之间有关联或需要方法支持时。
- 字典方法更适合简单的配置，特别是当配置需要频繁动态修改或序列化时。
- 读取方式：
  - 类：DB.host
  - 字典：config['DB']['host']
- 代码提示：class提供更好的代码提示，字典需要手动添加注释
- 动态修改：字典可以随时修改，类需要重新实例化
- 继承：字典无法继承，类可以继承

```python
class Config:
    DB_HOST = "localhost"
    DB_PORT = 5432
    DB_USER = "postgres"
    DB_PASSWORD = "password"

config = Config()
```
