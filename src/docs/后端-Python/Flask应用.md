# 创建Flask应用

##### app.py

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
	return "<p>Hello, World!</p>"

if __name__ == "__main__":
	# debug为True时，修改代码自动重启，如果请求期间发生错误，服务器将在浏览器中显示交互式调试器。
	# （非必须）host='0.0.0.0'，指定应用服务域名为本机
	# （非必须）port=8080，指定应用端口
	app.run(debug=True, host='0.0.0.0', port=8080)
```

##### 启动应用 `python app.py`

# 路由

##### 路径规则

```python
# 使用路由参数
@app.route('/user/<username>')
def show_user_profile(username):
    return f'User {username}'

# 使用转换器，指定路由参数类型
# int 正整数
# float 正浮点数
# path 路径，可包含/
# uuid
@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post {post_id}'

# / 结尾，访问/projects时会重定向到/projects/
# 如果没有 / 结尾，只能通过 /projects 访问， /projects/ 会 404
@app.route('/projects/')
	return 'The project page'
```

##### HTTP方法

```python
from flask import request

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return do_the_login()
    else:
        return show_the_login_form()
```

##### 用Blueprint组织路由

```python
from flask import Blueprint

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    return f'用户id: {user_id}'

# 然后在主应用中注册蓝图
app.register_blueprint(user_bp)
```

# 特殊目录

##### static目录

static目录中的文件为静态文件，可直接通过/static/filename路径访问

##### templates目录

通过render_template(filename, name='html接收的变量')渲染html模板返回给前端

# 请求处理

### 获取上传数据

- request.form 表单数据
- request.files 上传文件
- request.cookies.get('keyname') 获取cookies数据

# 请求响应

### 错误处理

```python
@app.errorhandler(Exception)
def handle_exception(e):
	if isinstance(e, HTTPException):
		# 处理HTTPException错误
        return e

	# 处理其他错误
	return {
		"error": "系统异常，请刷新重试",
		"message": str(e)
	}, 500
```

### 统一响应格式

```python
from flask import jsonify
from flask import make_response

def http_success(data, status_code: int = 200):
    return make_response(jsonify({
        "successful": True,
        "code": "200",
        "message": "success",
        "data": data
    }), status_code)


def http_error(msg: str, status_code: int = 500):
    return make_response(jsonify({
        "successful": False,
        "code": "9999",
        "message": msg
    }), status_code)
```

### 响应类型

- 文件：`send_file(data, as_attachment=True, download_name=data)`
- 纯文本：`make_response("这是纯文本内容", status_code, {'Content-Type': 'text/plain; charset=utf-8'})`,可省略make_response
- json：`jsonify(data), status_code`
- html：`render_template("index.html", data=data)`
- 重定向：`redirect('/login')`

### 响应拦截

```python
@app.after_request
def after_request(response):
	response.headers.add('Access-Control-Allow-Origin', '*')
	response.headers.add('Access-Control-Allow-Credentials', 'true')
	return response
```

# 日志

### 初始化日志

```python
import os
from loguru import logger
from settings import Logger

def log_init():
    # 创建日志目录
    if not os.path.exists(Logger.log_file_path):
        os.makedirs(Logger.log_file_path)

    log_file = os.path.join(Logger.log_file_path, 'racp.log')
    # 输出一条信息级日志，显示日志文件的完整路径和轮转设置。
    logger.info("log file at [{}], rotation[{}]", os.path.abspath(log_file), Logger.log_file_rotation)
    # 配置日志的输出
    # 轮转策略，可能为'100 MB'，'1week', '1d'，'1h'，'1m'，'1s'等，100 MB 表示当文件大小达到 100 MB 时，会自动创建一个新的日志文件。
    logger.add(log_file, rotation=Logger.log_file_rotation)
```

# 数据库

### 数据库配置

```python
# 应用配置
class APPConfig:
	# sqlalchemy配置
	# 关闭对模型更改的跟踪（节省内存）
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	# 配置数据库引擎选项
	SQLALCHEMY_ENGINE_OPTIONS = {
		"pool_size": 50, #连接池的最大连接数
		"pool_timeout": 60, #在超时前等待连接的秒数
		"pool_recycle": 1800, #连接被重置前的存活时间（秒），防止数据库连接长期占用
	}
	# 禁用 SQLAlchemy 的调试输出
	SQLALCHEMY_ECHO = False

# 处理多个数据库
from settings import DB
def_db_uri = None
dbs_dict = dict()
for k, v in DB.dbs.items():
	# 默认数据库配置
    db_options = {
        "url": f'mysql+pymysql://{v["username"]}:{v["passwd"]}@{v["host"]}/{v["database"]}?charset=utf8mb4&autocommit=false',
        "pool_size": v.get('pool_size', 20),
        "pool_timeout": v.get('pool_timeout', 60),
        "pool_recycle": v.get('pool_timeout', 1800)
    }
    dbs_dict.setdefault(k, db_options)
    if def_db_uri is None:
	    # 第一个数据库地址作为默认数据库地址
        def_db_uri = db_options.get('url')
       
if len(dbs_dict) > 0:
    APPConfig.SQLALCHEMY_DATABASE_URI = def_db_uri
    if len(dbs_dict) > 1:
	    # 多个数据库配置
        APPConfig.SQLALCHEMY_BINDS = dbs_dict

app = Flask(__name__)
app.config.from_object(APPConfig)
```

### 初始化数据库

```python
from flask_sqlalchemy import SQLAlchemy

class CustomModel(Model):
	# 将数据库的字段转换为字典
	def to_dict(self):
		res = {}
		for col in self.__table__.columns:
			value = getattr(self, col.name)
			if isinstance(value, datetime):
				# 统一处理日期格式
				value = datetime_util.fmt(value, local=False)
			res[col.name] = value
		return res

	# 将字典转换为json格式
	def json(self):
		return json.dumps(self.to_dict())

# 初始化数据库实例
# model_class指定数据库模型类继承自 CustomModel
# echo为False运行查询时不输出 SQL 语句，调试时可用True
db = SQLAlchemy(model_class=CustomModel,
				engine_options={"echo": False})

def init_app(app):
	db.init_app(app)
```

### 使用数据库flask_sqlalchemy

##### 用MySQL创建数据库

##### 定义模型

```python
# 引入数据库实例
from src.base import db

class User(db.Model):
	__tablename__ = 'users'
	id = db.Column(db.BigInteger, primary_key=True, autoincrement=True, comment='用户ID')
	name = db.Column(db.String(50), nullable=False, unique=True, comment='用户名')
	role = db.Column(db.Integer, nullable=False, comment='用户角色，枚举值为1、2、4、8、16、32')
	age = db.Column(db.Integer, nullable=False, comment='年龄')
	created_time = db.Column(db.DateTime, server_default=db.func.now(), comment='创建时间')
	updated_time = db.Column(db.DateTime, onupdate=db.func.now(), comment='更新时间')
```

##### CRUD操作

```python
# 创建create
new_user = User(name='Tuxin', role=1)
db.session.add(new_user)
db.session.commit()

# 查询read
# 查询所有用户
user = User.query.all()
# 查询特定用户
tuxin = User.query.filter_by(name='Tuxin').first()
# 根据条件查询
adults = User.query.filter(User.age > 18).all()
# 分页查询
page_users = User.query.paginate(page=1, per_page=10)
# 排序查询
order_users = User.query.order_by(User.name).paginate(page=1, per_page=10)
# 聚合查询，
group_users = User.query.group_by(User.role).all()

# 更新update
user.role = 2
db.session.commit()

# 删除delete
db.session.delete(user)
db.session.commit()
```

##### 其他操作

```python
# 计数
# 平均值
# 最大值
```

##### 关系与外键

##### 使用SQLAlchemy的ORM

```python
# 查询
# 查询所有用户
```
