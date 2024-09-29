# 创建表

- `CREATE TABLE 'table_name' ()`：创建新表
  - `ENGINE=InnoDB` 指定表的存储引擎为InnoDB
  - `DEFAULT CHARSET=utf8mb4` 默认表的字符格式为utf8mb4
  - `COLLATE=utf8mb4_general_ci` 表的排序规则
  - `COMMENT` 表的说明

# 修改表

- 添加列 `ALTER TABLE users ADD COLUMN age TINYINT NOT NULL UNSIGNED;`
- 删除列 `ALTER TABLE users DROP COLUMN age;`
- 修改列 `ALTER TABLE users MODIFY COLUMN age TINYINT NOT NULL;`
- 修改列名 `ALTER TABLE users CHANGE COLUMN old_column_name new_column_name TINYINT NOT NULL;`
- 重命名表 `ALTER TABLE old_table_name RENAME TO new_table_name;`

# 数据类型

- `INT`：整数
- `TINYINT`：小整数
- `BIGINT`：大整数
- `VARCHAR(n)`：可变长度字符串，最大长度为 n
- `TEXT`：无限制长度字符串
- `JSON`
- `DATETIME`

# 列属性

- `DEFAULT NULL`：设置列的默认值为NULL
- `NOT NULL`：不允许为空
- `AUTO_INCREMENT`：自增
- `COMMENT`：为列或表添加说明
- `PRIMARY KEY('id')`：定义id字段为主键
- `UNIQUE KEY('task_id')`：定义唯一索引，支持联合多个字段，如`UNIQUE KEY 'uk_item_task_id' ('item_id', 'task_id')`
- `CHARACTER SET utf8mb4`：定义字符集为utf8mb4，支持中文、表情符号等
- `COLLATE`: 设置排序规则
  - `utf8mb4_general_ci`: 不区分大小写的通用排序规则，适用于大多数语言。
  - `utf8mb4_unicode_ci`: 不区分大小写的 Unicode 排序规则，支持多种语言的字符比较，处理更准确。
  - `utf8mb4_bin`: 二进制排序规则，区分大小写，按字节比较。
  - `utf8mb4_0900_ai_ci`: 不区分大小写的 Unicode 排序规则，支持最新的 Unicode 版本，适用于多种语言。
  - `utf8mb4_0900_as_cs`: 区分大小写的 Unicode 排序规则，支持最新的 Unicode 版本。
