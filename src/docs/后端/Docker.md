# Docker

## 基础概念

- 镜像：镜像是一个只读的模板，用于创建Docker容器。镜像包含运行应用程序所需的所有代码、库、环境变量和配置文件等。
- 容器：容器是镜像的运行实例。容器是基于镜像创建的，可以包含多个应用程序和它们的依赖。容器是独立的，可以在任何地方运行，并且可以随时销毁和重建。
- 仓库：仓库是存储镜像的地方。仓库可以是公共的，也可以是私有的。仓库可以包含多个镜像，每个镜像都有一个唯一的标签。
- 服务：服务是容器的”模板“，描述了容器运行时所需的配置和环境变量。一个服务可以包含多个容器，这些容器共享相同的服务配置。

### 理解

- 创建镜像 ≈ 定义类
- 运行容器 ≈ 实例化对象
- Dockerfile ≈ 类的定义文件，描述了镜像的构建过程
  - 创建镜像：`docker build -t my-image .`
  - 运行容器：`docker run -d -p 8080:8080 my-image`
- docker-compose.yml ≈ 对象的定义文件，描述了容器的运行环境，可同时运行多个容器
  - 运行容器：docker-compose up -d
- 容器的环境变量 ≈ 对象的属性
- 容器中运行的进程 ≈ 对象的方法

## Dockerfile

```dockerfile
# 使用python:3.9镜像，镜像从docker hub上获取
FROM python:3.9

# 设置作者
MAINTAINER zhangsan

# 设置工作目录
WORKDIR /app

# 将当前目录下的所有文件复制到容器的工作目录中
COPY . .

# 使用清华源安装依赖
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 暴露端口
EXPOSE 8080

# 使用 gunicorn 运行 Flask 项目，并指定配置文件
CMD gunicorn -c gunconf.py main:app
```

## docker-compose.yml

```yaml
version: "3"
services:
  # 服务1：Web应用
  web:
    # image: 指定镜像名称，如果同时指定了build和iamge，则image表示新构建的镜像名称，如果只指定image，则表示从镜像仓库拉取镜像
    image: my-web-app
    # 使用当前目录的Dockerfile构建镜像
    build: .
    # 指定容器名称，如果不指定，Docker Compose会基于以下规则自动生成一个名称：项目名称_服务名称_序号
    container_name: my-web-app
    # 指定容器重启策略，always表示无论退出状态如何，总是重启容器
    restart: always
    # 将容器的5000端口映射到主机的5000端口
    ports:
      - "5000:5000"
    # 启动多个容器，优点：负载均衡，滚动更新，灰度发布，缺点：资源浪费
    # 也可以通过docker-compose up scale web=5来快速启动/扩展多个容器
    deploy:
      replicas: 3 # 指定启动的容器数量

  # 服务2：Redis缓存
  redis:
    # 使用官方Redis Alpine版本镜像，无需额外构建镜像
    image: "redis:alpine"
    # 不指定端口，意味着不暴露端口，只能在docker内部访问

  # 服务3：PostgreSQL数据库
  db:
    # 使用PostgreSQL 12版本镜像
    image: "postgres:12"
    # 设置数据库环境变量
    environment:
      - POSTGRES_DB=myapp
```
