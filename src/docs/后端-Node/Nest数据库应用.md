# 配置Mysql

### 配置环境变量

在config/env.ts中配置不同环境读取环境变量

```ts
import * as fs from "fs";
import * as path from "path";
const isProd = process.env.NODE_ENV === "production";

function parseEnv() {
  const localEnv = path.resolve(".env");
  const prodEnv = path.resolve(".env.prod");

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error("缺少环境配置文件");
  }

  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  return { path: filePath };
}

export default parseEnv();
```

### 获取环境变量配置

使用`@nestjs/config`，`@nestjs/config`依赖于dotenv，可以通过key=value形式配置环境变量，项目会默认加载根目录下的.env文件

#### 在`app.module.ts`中连接数据库：

```ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';

@Module({
  imports: [
    ConfigModule.forRoot({ 
    isGlobal: true,  // 设置为全局
    envFilePath: [envConfig.path] 
   }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [],  // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'),   // 用户名
        password: configService.get('DB_PASSWORD', 'root'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    })
  ],
 ...
})
export class AppModule {}
```

# TypeORM操作数据库

### 安装 `TypeORM`操作数据库

`npm install @nestjs/typeorm typeorm mysql2 -S`

### 创建数据库映射实体Entity

### 数据库表关系

##### 梳理实体关系图

![[数据库设计.png]]

##### 一对一

```ts
// user实体
@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  // 在装饰器中需要指定对方`entity`的类型，以及指定对方`entity`的外键
  @OneToOne(type => UserInfoEntity, info => info.user)
  // `@JoinColumn` 必须在且只在关系的一侧的外键上, 你设置`@JoinColumn`的哪一方，哪一方的表将包含一个`relation id`和目标实体表的外键。记住，不能同时在二者`entity`中。
  @JoinColumn()
  info: UserInfoEntity;
}

// userInfo实体
@Entity("userInfo")
export class UserInfoEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  idcard: string;

  @Column()
  gender: string;

  @OneToOne(type => UserEntity, user => user.info)
  user: UserEntity;
}
```

##### 一对多

```ts
// 主实体
@Entity("category")
export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => PostEntity, post => post.category)
  posts: PostEntity[];
}

// 实体1
@Entity("post")
export class PostEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50 })
  title: string;

  @Exclude()
  @ManyToOne(() => CategoryEntity, category => category.posts)
  // 自定义连接列名category_id
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;
}
```

##### 多对多

```ts
// 主实体
@Entity('post')
export class PostEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 50 })
	title: string;

	@ManyToMany(() => TagEntity, tag => tag.posts)
	// `@JoinTable`用于描述“多对多”关系，并描述`中间表`表的连接列。 
	// `中间表`是通过TypeORM 自动创建的一个特殊的单独表， 其中包含引用相关实体的列。
	// 通过配置`joinColumns`和`inverseJoinColumns`来自定义`中间表`的列名称。
	@JoinTable({
		name: "post_tag",
		joinColumns: [{ name: 'post_id' }],
		inverseJoinColumns: [{ name: 'tag_id' }],
	})
	tags: TagEntity[];
}

// 实体1
@Entity('tag')
export class TagEntity {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column({ length: 50 })
	name: string;

	@ManyToMany(() => PostsEntity, post => post.tags)
	posts: PostEntity[];
```

# Redis

`Nest`为各种缓存存储提供统一的API，内置的是内存中的数据存储，但是也可使用 `cache-manager`来使用其他方案， 比如使用`Redis`来缓存。

### 安装依赖

`npm install cache-manager cache-manager-redis-store @types/cache-manager --save`
