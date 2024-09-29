# Gunicorn

Green Unicorn，是一个Python WSGI HTTP服务器。

- **高效的服务器**：能够**并发处理大量的 HTTP 请求**，特别适用于部署 Python Web 应用程序，如使用 Flask 或 Django 框架开发的应用。通过使用**多进程或多线程**的方式，可以充分利用服务器的资源，提高应用的响应速度和吞吐量。
- `gunicorn myapp:app` 表示，使用 gunicorn 启动 myapp.py 文件中的 app 对象。
- `gunicorn -c gunicorn_config.py myapp:app` 表示，使用 gunicorn 启动 myapp.py 文件中的 app 对象，并使用 gunicorn_config.py 配置文件中的配置。
- 也可以不使用配置文件，直接使用命令行参数，如：`gunicorn -w 4 -k gevent myapp:app`，其中 -w 4 表示使用 4 个工作进程，-k gevent 表示使用 gevent 协程。或者 `gunicorn --workers 4 --worker-class gevent myapp:app`

## 配置文件

```py
# 导入python默认自带的multiprocessing模块
import multiprocessing
# 并行工作进程数，multiprocessing.cpu_count() 表示使用当前机器上的CPU核心数
workers = multiprocessing.cpu_count() * 2 + 1
# 指定每个工作者的线程数
threads = 90
# 监听内网端口80
bind = '0.0.0.0:8080'
# 工作模式协程，gevent协程可以提高并发量，其他选项：sync（同步），eventlet（基于协程），gevent（基于协程）
worker_class = 'gevent'
# 设置最大并发量
worker_connections = 2000
# 设置进程文件目录，gunicorn启动后会创建gunicorn.pid文件，并将主进程ID写入该文件
# 重启进程：kill -HUP `cat gunicorn.pid` 或 kill -HUP $(cat gunicorn.pid)。HUP即 hanngup，挂起
# 停止进程：kill -QUIT `cat gunicorn.pid`
# 终止进程：kill -TERM `cat gunicorn.pid`，与kill -QUIT不同，kill -TERM会等待进程完成当前任务后再终止。
# 查看进程：ps -ef | grep gunicorn，ps指process statu，e指everything，f指full format，显示更多进程信息
# 查看进程：ps aux | grep gunicorn 查看所有进程，a指all，u指user以用户为主的格式来显示进程信息，x指显示没有控制终端的进程（包括守护进程和后台运行的进程）
# 查看进程ID：cat gunicorn.pid
pidfile = 'gunicorn.pid'
# 设置访问日志和错误信息日志路径
accesslog = 'gunicorn_acess.log'
errorlog  = 'gunicorn_error.log'
# 设置日志记录水平
loglevel = 'info'
# 代码发生变化是否自动重启
reload=True
```
