- **哈希算法**：实现数据的均匀分布和快速查找，哈希值可以帮助确定数据存储的位置
- **@classmethod**：python内置的一个装饰器，用于定义类方法。与实例方法不同，类方法的第一个参数是类本身（通常命名为 cls），而不是实例（通常命名为 self）。这使得类方法可以访问类的属性和其他类方法，而不需要实例化对象。
- **`cls.__dict__`**：`cls.__dict__` 是 Python 中的一个内置属性，表示类的命名空间。它是一个字典，包含了类的所有属性和方法，包括类变量、实例方法和类方法。
- **哈希算法**：使用 SHA-256 等哈希算法可以生成一个固定长度的哈希值，确保不同字符串的哈希值尽可能唯一。

```python
class HashShardTable(object):
	"""
	以hash值进行分库分表
	在定义Model子类时，增加以下类属性，同时model子类继承HashShardTable
	__bind_key__ 数据库前缀，配置SQLAlchemy.SQLALCHEMY_BINDS
	__db_num__ 分库数量，不配置代表不分库
	__tablename__ 表名
	__table_num__ 分表数量

	例子
	See :class:`src.other.models.tt_commodity_shard`
	"""
	_column_mapper = {}
	# 线程锁，防止多个线程同时修改共享数据，导致数据不一致或错误
	mutex = threading.Lock()

	@classmethod
	def get_cls_def(cls) -> dict:
		"""
		获取列定义
		"""
		# 类的路径+类的名称组成的key
		sc_k = '.'.join([cls.__module__, cls.__name__])
		defs = HashShardTable._column_mapper.get(sc_k, None)
		if not defs:
			# 所有数据库字段对应的值
			defs = {}
			# 所有数据库字段columns
			cs = []
			# 类的所有属性和方法
			c_dict = cls.__dict__
			for k, v in c_dict.items():
				if isinstance(v, db.Column):
					v_c = v.copy()
					defs[k] = v_c
					cs.append(k)
			for k in cs:
				delattr(cls, k)
			# 将defs添加到_column_mapper中
			HashShardTable._column_mapper[sc_k] = defs

		# 克隆defs字典并返回
		cp = {k: v.copy() for k, v in defs.items()}
		return cp

	@classmethod
	def get_has_val(cls, shard_hash_val: Union[int, str]):
		"""
		计算hash值
		分库分表的键shard_hash_val不仅仅支持整数，也支持字符串（如用户ID、订单号等）
		"""
		if isinstance(shard_hash_val, int):
			return abs(hash(shard_hash_val))
		else:
			hash_str = hashlib.sha256(shard_hash_val.encode())
			# 将哈希值转换为十六进制字符串并转为整数
			return abs(int(hash_str.hexdigest(), 16))

	@classmethod
	def get_db_route(cls, shard_hash_val):
		"""
		计算DB的路由
		"""
		hv = cls.get_has_val(shard_hash_val)
		return hv % cls.__db_num__

	@classmethod
	def get_table_route(cls, shard_hash_val):
		"""
		计算表的路由
		"""
		hv = cls.get_has_val(shard_hash_val)
		return hv % cls.__table_num__

	@classmethod
	def get_all_db_route(cls):
		"""
		获取所有分库的路由
		"""
		db_num = getattr(cls, '__db_num__', 1) # 分库数量
		bind_key = getattr(cls, '__bind_key__', None) # 数据库名称

		# 分库
		if bind_key and db_num and db_num > 1:
			# 生成从0到db_num-1的可迭代对象
			db_rs = range(db_num)
		else:
			db_rs = None
		return db_rs

	@classmethod
	def get_all_table_route(cls):
		"""
		获取所有分表的路由
		"""
		t_num = getattr(cls, '__table_num__', 1) #分表数量
		table_name = getattr(cls, '__tablename__', '') #表名

		if table_name and t_num and t_num > 1:
			t_rs = range(t_num)
		else:
			t_rs = None
		return t_rs

	@classmethod
	def gen_model_cls(
		cls,
		class_name,
		table_name,
		db_r: int = None,
		t_r: int = None,
		bind_key=None):
		"""
		生成分库分表的class
		"""
		shard_db = bind_key is not None and db_r is not None
		if shard_db:
			c_n = f'{class_name}_{db_r}_{t_r}' # 类的所属分库分表
			t_n = f'{table_name}_{t_r}' #类的所属分表
			bk = f'{bind_key}_{db_r}' #类的所属分库
		else:
			c_n = f'{class_name}_{t_r}'
			t_n = f'{table_name}_{t_r}'

		def _repr(self) -> str:
			return f'{c_n}({t_n})'

		mc_def = {
			'__module__': __name__, #模块名，当前类名
			'__name__': c_n, #新类名，包含所属分库分表
			'__tablename__': t_n, #表名
			'__repr__': _repr, #repr方法调用时返回一个字符串，表示模型类的名称和表名，用于调试
			'__t_r__': t_r #所属分表
		}
		if shard_db:
			# bind_key为数据库名称，如user_db，而 db_r为数据库实例，如0，要连接的数据库为user_db_0
			mc_def['__db_r__'] = db_r
			mc_def['__bind_key__'] = bk
		cls_def = cls.get_cls_def()
		# 将类的列定义字典添加到mc_def
		mc_def.update(cls_def)
		# type创建新类，类名为c_n，基类为(cls, db.Model,)，mc_def为新类的属性和方法
		model_cls = type(c_n, (cls, db.Model,), mc_def)
		return model_cls

	@classmethod
	def init_model_cls(cls):
		"""
		初始化分库分表对应的class
		"""
		# 获取线程锁
		cls.mutex.acquire()
		# 生成分库分表的class定义
		# 通过__init_shard__属性判读是否已初始化
		if not hasattr(cls, '__init_shard__'):
			# _mapper记录分库分表的类
			cls._mapper = {}
			# 分库
			db_rs = cls.get_all_db_route()
			# 分表
			t_rs = cls.get_all_table_route()
			class_name = cls.__name__
			bind_key = getattr(cls, '__bind_key__', None)
			table_name = getattr(cls, '__tablename__', '')
			if table_name.endswith("_"):
				# 去掉在最后的_
				table_name = table_name[0:-1]
			# 遍历所有分库分表并创建class
			if db_rs:
				# 有分库、分表
				for db_r in db_rs:
					for t_r in t_rs:
						m_c = cls.gen_model_cls(class_name, table_name, db_r, t_r, bind_key)
						cls._mapper[m_c.__name__] = m_c
			else:
				# 无分库、有分表
				for t_r in t_rs:
					m_c = cls.gen_model_cls(class_name, table_name, t_r=t_r)
					cls._mapper[m_c.__name__] = m_c
			# 标记为已初始化
			cls.__init_shard__ = 1
		# 释放线程锁
		cls.mutex.release()

	@classmethod
	def get_all_model_cls(cls) -> dict:
		"""
		获取所有的分库分表class
		"""
		cls.init_model_cls()
		return cls._mapper

	@classmethod
	def get_model_cls(cls, shard_hash_val: Union[int, str] = None, db_r: int = None, t_r: int = None):
		"""
		获取指定分库分表的class，可以传hash值，或者指定分库分表路由
		param: shard_hash_val，分库分表的hash值，一般是表里面字段或者字段组合，通过该值，将数据库的读写均匀分布到不同的分库分表中，实现负载均衡，减少数据库压力
		param: db_r，分库路由
		param: t_r，分表路由
		"""
		if shard_hash_val is None and db_r is None and t_r is None:
		return None

		cls.init_model_cls()
		if shard_hash_val is not None:
			db_num = getattr(cls, '__db_num__', 1)
			bind_key = getattr(cls, '__bind_key__', None)

		# 分库
		if bind_key and db_num and db_num > 1:
			db_r = cls.get_db_route(shard_hash_val)

		# 分表
		t_num = getattr(cls, '__table_num__', 1)
		table_name = getattr(cls, '__tablename__', '')
		if table_name and t_num and t_num > 1:
			t_r = cls.get_table_route(shard_hash_val)

		class_name = cls.__name__
		if db_r is not None:
			c_n = f'{class_name}_{db_r}_{t_r}'
		else:
			c_n = f'{class_name}_{t_r}'

		model_cls = cls._mapper.get(c_n, None)
		return model_cls
```
