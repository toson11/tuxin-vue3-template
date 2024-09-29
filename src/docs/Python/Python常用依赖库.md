# Python常用依赖库

## os（自带），用于处理操作系统相关的功能

- 获取当前文件的目录：`os.path.dirname(__file__)`
- 获取文件绝对路径：`os.path.join(os.path.dirname(__file__), "文件名")`
- 获取当前工作目录：`os.getcwd()`
- 获取环境变量：`os.environ.get("SECRET_KEY", "default_value")`（推荐）或`os.getenv("SECRET_KEY")`

## base64（自带），用于编码和解码base64

## typing（自带），用于类型提示

## yaml（需安装PyYAML），用于读取和写入YAML文件

## json（自带），用于处理JSON数据

## logging（自带），用于日志记录

## argparse（自带），用于解析命令行参数

## sys（自带），用于获取系统信息和操作Python运行时环境

## requests（需安装），用于发送HTTP请求

## datetime（自带），用于处理日期和时间

## re（自带），用于正则表达式操作

## collections（自带），提供额外的数据结构（如defaultdict、Counter等）

## itertools（自带），用于高效循环和迭代器操作

## math（自带），提供数学运算函数

## numpy（需安装），用于科学计算和大型多维数组操作

## pandas（需安装），用于数据分析和处理

## matplotlib（需安装），用于数据可视化

## sqlalchemy（需安装），用于数据库操作的ORM工具

## pillow（需安装），用于图像处理
