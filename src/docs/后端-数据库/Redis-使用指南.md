## 初始化redis

```python
import json
import logging
import math
import os
from threading import current_thread
from typing import Dict, List, Optional, Callable, Any

import redis
from redis.client import PubSub

from settings import Redis
from src.utils import ip_util


class RedisHelper:
    def __init__(self, rds_conn: redis.Redis):
        # 获取本机ip和pid，pid为进程id
        self._ip = ip_util.get_local_ip()
        self._pid = os.getpid()
        # 保存redis连接对象
        self._conn = rds_conn

    def conn(self) -> List:
        return self._conn

    # 获取本机ip和pid，pid为进程id
    def get_local_id(self, thread_id: int = None, just_process: bool = False) -> str:
        _id = self._ip + ":" + str(self._pid)
        if not just_process:
            if not thread_id:
                thread_id = current_thread().ident
            _id += ":" + str(thread_id)
        return _id

    # 加锁，timeout为锁的过期时间，thread_id为线程id
    def lock(self, key: str, timeout: int = 0, thread_id: int = None) -> bool:
        val = self.get_local_id(thread_id=thread_id)
        if timeout > 0:
            # 设置锁的过期时间，并设置锁的值，nx表示如果锁不存在则设置锁的值，ex为过期时间
            r = self._conn.set(name=key, value=val, ex=timeout, nx=True)
        else:
            # 设置锁的值，nx表示如果锁不存在则设置锁的值
            r = self._conn.set(name=key, value=val, nx=True)
        if r:
            # 如果锁存在，则返回True
            return True
        return False

    # 解锁，force为是否强制解锁，thread_id为线程id
    def unlock(self, key: str, force: bool = False, thread_id: int = None) -> bool:
        val = self.get_local_id(thread_id=thread_id)
        old_val = self._conn.get(key)
        # 如果force为True，或者锁的值相等，则删除锁
        if force or old_val == val:
            r = self._conn.delete(key)
            if r:
                return True
        return False

    # 获取key的值
    def get(self, name: str) -> str:
        return self._conn.get(name=name)

    # 获取多个key的值
    def mget(self, names: List[str]) -> List[str]:
        return self._conn.mget(names)

    # 设置key的值
    def set(self, name: str, val: str, **kwargs) -> bool:
        return self._conn.set(name=name, value=val, **kwargs)

    # 设置key的过期时间
    def expire(self, name: str, time: int, **kwargs) -> bool:
        return self._conn.expire(name=name, time=time, **kwargs)

    # 设置多个key的值
    def mset(self, nvs: Dict[str, str]) -> str:
        return self._conn.mset(nvs)

    # 删除key
    def delete(self, *names: str) -> str:
        return self._conn.delete(*names)

    # 设置hash的值，用于存储对象，与set不同，set是存储一个值，而hset是存储一个键值对
    def hset(self, name: str, mapping: Dict) -> int:
        return self._conn.hset(name=name, mapping=mapping)

    # 获取hash的值，用于获取对象
    def hget(self, name: str, key: str) -> Optional[Dict]:
        try:
            res = self._conn.hget(name, key)
            return json.loads(str(res))
        except json.JSONDecodeError as e:
            logging.error(f"{e}")
            return None

    # 获取hash的所有值，用于获取对象
    def hgetall(self, name: str) -> Dict:
        return self._conn.hgetall(name)

    # 删除hash的值，用于删除对象
    def hdel(self, name: str, keys: str) -> int:
        return self._conn.hdel(name, keys)

    # 自增，用于计数
    def incr(self, name: str) -> str:
        return self._conn.incr(name)

    # 自增，用于计数，与incr不同，incr是自增1，而incrby是自增指定的值
    def incrby(self, name: str, amount: int) -> str:
        return self._conn.incrby(name, amount)

    # 发布消息，用于发布消息
    def publish(self, channel: str, msg: str) -> Any:
        return self._conn.publish(channel, msg)

    # 订阅消息，用于订阅消息
    def pubsub(self, **kwargs) -> PubSub:
        return self._conn.pubsub(**kwargs)

    # 订阅消息，用于订阅消息，与pubsub不同，pubsub是订阅消息，而subscribe_and_run是订阅消息并执行
    def subscribe_and_run(self, ps: PubSub = None, sleep_time: int = 1, **kwargs) -> Any:
        if ps is None:
            ps = self.pubsub()
        ps.subscribe(**kwargs)
        ps.run_in_thread(sleep_time=sleep_time)


# 连接redis
def redis_conn() -> redis.Redis:
    un = '' if Redis.username is None else Redis.username
    pwd = '' if Redis.password is None else Redis.password
    redis_url = f'redis://{un}:{pwd}@{Redis.host}:{Redis.port}/{Redis.db}'
    # 连接redis，返回redis连接对象
    return redis.StrictRedis.from_url(redis_url, encoding="utf8", decode_responses=True)


def get_worker_hashs(wpk: str, wnk: str, walk: str) -> List[int]:
    """
    wpk 待分配工作数量的key，需要初始化
    wnk 工人数量的key，需要初始化
    walk 控制分配数量的key，不需要初始化，重新分配时要清掉或者置为0
    """
    whs = []
    work_pool = redis_helper.get(wpk)
    work_num = redis_helper.get(wnk)
    if (work_pool is None or work_num is None
            or int(work_pool) <= 0 or int(work_num) <= 0):
        return whs
    avg_work = math.ceil(int(work_pool) / int(work_num))
    for i in range(avg_work):
        n = redis_helper.incr(walk)
        if n > int(work_pool):
            break
        whs.append(n - 1)
    return whs


# 初始化redis连接
redis_helper = RedisHelper(redis_conn())


class RedisLock:
    """
    使用redis实现分布式锁，用于分布式锁
    """
    rh: RedisHelper
    key: str
    timeout: int
    lock: bool = False

    def __init__(self, key: str, timeout: int = 0, rh: RedisHelper = redis_helper):
        # 初始化
        self.rh = rh
        self.key = key
        self.timeout = timeout

    def __enter__(self):
        # 进入时加锁
        self.lock()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # 退出时解锁
        self.unlock()
        return False

    # 加锁
    def lock(self):
        self.lock = self.rh.lock(key=self.key, timeout=self.timeout)
        return self

    # 是否已加锁
    def is_lock(self):
        return self.lock

    # 解锁
    def unlock(self):
        if self.lock:
            self.rh.unlock(key=self.key)

    # 加锁并执行回调
    def lock_and_release(self, succ_call: Callable, fail_call: Callable):
        self.lock = self.rh.lock(key=self.key, timeout=self.timeout)
        if self.lock:
            try:
                succ_call(self)
            finally:
                self.rh.unlock(key=self.key)
        else:
            fail_call(self)
        return self
```

## redis与db的区别

> 当需要高速读写、临时存储或简单数据结构时，使用 Redis；当需要复杂查询、持久化存储或强一致性事务时，使用传统数据库。

1. 读写位置和速度：redis是内存数据库（可选择性持久化到磁盘），比较快；db是文件数据库，比较慢
2. 数据结构：redis支持多种数据结构，db主要使用表结构
3. 数据类型：redis主要用于缓存，db主要用于存储数据
4. 数据一致性：redis不支持事务，db支持事务

## 查看redis状态

- 查看redis是否运行 `ps -ef | grep redis`，如果看到redis-server进程及其监听地址，说明redis正在运行
- 检查redis进程 `ps aux | grep redis-server`
- 检查redis连接 `redis-cli ping`, 如果返回PONG，说明redis正在运行

## 进入redis

- 进入redis `redis-cli`
  - 查看redis信息 `info`
  - 退出redis `exit`
