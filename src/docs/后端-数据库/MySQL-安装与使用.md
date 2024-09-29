# 安装 MySQL

从官网下载安装包,按提示完成安装。

# 启动 MySQL

### 配置环境变量

在.zshrc文件中添加:

```bash
export PATH="/usr/local/mysql/bin:$PATH"
```

### 启动 MySQL

在终端中输入下面对命令或者mac电脑打开系统设置，在左侧菜单中找到mysql，点击启动。

```bash
sudo mysqld_safe
```

# 关闭 MySQL

在终端中输入：

```bash
sudo mysqladmin shutdown
```

# 登录 MySQL

在终端中输入 `mysql -u root -p`，然后输入密码即可。
如果输入`mysql -u root`直接进入mysql，则说明密码为空。

# 用户管理

- 设置密码：`ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';`
- 查看用户：`SELECT User, Host, plugin FROM mysql.user;`
- 创建用户：`CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';`
- 删除用户：`DROP USER 'username'@'localhost';`

# MySQL 状态检查

- 检查 MySQL 进程 `ps aux | grep mysql` 或 `ps -ef | grep mysql`
- 检查 MySQL 连接 `mysqladmin -u root -p ping`
- 查看 MySQL 用户 `mysql -u root -p`

# 常用命令

- 关闭 MySQL 服务: `sudo mysqladmin shutdown`
- 启动 MySQL 服务: `sudo mysqld_safe`
