# Python常用方法

## 深度获取字典key的值

```python
# 支持字符串和列表两种传入方式，如'a.b.c'和['a', 'b', 'c']
def get_deep(obj: Dict, fields: Union[str, List[str]], default=None) -> Any:
    if isinstance(fields, str):
        fields_list = fields.split(".")
        return get_deep(obj, fields_list, default)
    if not isinstance(obj, dict):
        return default
    if len(fields) == 1:
        return obj.get(fields[0], default)
    return get_deep(obj.get(fields[0]), fields[1:], default)
```

## 将列表中的字典按照指定的字段分组

```python
def dict_group(dicts: List[Dict], field: str) -> Dict[str, List[Dict]]:
    result = {}
    for d in dicts:
        ## 获取字典中指定字段的值，如果字段不存在，则返回None
        value = str(d.get(field, None))
        ## 获取字典中指定字段的值，如果字段不存在，则返回None
        sub_list = result.get(value, None)
        ## 如果字段不存在，则创建一个空列表
        if sub_list is None:
            sub_list = []
            result[value] = sub_list
        ## 将field字段值相同的字典添加到列表中
        sub_list.append(d)
    return result
```
