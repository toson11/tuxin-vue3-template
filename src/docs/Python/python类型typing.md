# python类型typing

## 引入类型

```python
from typing import List, Dict, Any
```

## 类型用法

- **List**: List[int]指整数列表
- **Dict**: Dict[str, int]指键为字符串，值为整数的字典
- **Optional**: Optional[int]表示一个可能为整数，也可能为None的类型
- **Union**: Union[int, str]表示一个可能为整数或字符串的类型
- **Tuple**: Tuple[int, str]表示一个包含一个整数和一个字符串的元组
- **Set**: Set[int]表示一个整数的集合
- **FrozenSet**: FrozenSet[int]表示一个不可变的整数集合
- **Any**: Any表示任意类型
- **Callable**: Callable[[int], str]表示一个接受一个整数参数并返回一个字符串的函数
- **Type**: Type[int]表示一个整数类型
- **Literal**: Literal[1, 2, 3]表示一个字面量类型，只能是1、2或3
- ...
