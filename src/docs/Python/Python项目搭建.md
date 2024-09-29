# python项目搭建

## 安装依赖

### requirements.txt

`requirements.txt`中包含所有依赖，安装依赖 `pip install -r requirements.txt`
-r 表示--requirement，指定依赖文件

```
./whl/zj_crypt_tool_go-1.0.0-py3-none-any.whl
certifi==2023.11.17
charset-normalizer==3.3.2
```

### whl（wheel）依赖

- whl实际上是一个 ZIP 压缩文件，只是扩展名改为了 .whl
- 可以理解为压缩后的依赖包，比如一些内部依赖，不方便上传到pypi，就可以使用whl文件，放在项目目录下的whl目录中

### 使用虚拟环境

安装依赖时使用虚拟环境，避免污染全局环境

- 创建虚拟环境: `python3 -m venv myenv`，在当前目录下创建一个虚拟环境目录myenv
- Windows: myenv\Scripts\activate
- macOS/Linux: source myenv/bin/activate，myenv表示当前目录下的虚拟环境目录，虚拟环境就是一个本地目录
- 退出虚拟环境: deactivate
- 依赖将会安装在虚拟目录下的/lib/pythonX.Y/site-packages/

## 启动项目

- 启动项目: `python3 run.py` 或 `./start.sh`
- ··start.sh

```shell
#! /usr/bin/env sh

set -e # set设置shell选项，-e，即errexit，在脚本发生错误时，立即退出而不是继续执行

# 声明变量
APP_MODULE="main:app"
GUNICORN_CONF="gunconf.py"

# 执行命令，启动项目，-c指定配置文件，"$APP_MODULE"指定启动模块
exec gunicorn -c "$GUNICORN_CONF" "$APP_MODULE"
```
