# 路由

### 声明路由

```ts
import {
  Controller,
  Get,
  Post,
  Res,
  Header,
  Body,
  Param
} from "@nestjs/common";
@Controller("user")
export class UserController {
  constructor(private readonly authService: AuthService) {}

  // 通配符路径
  @Post("user_*")
  // @Body()获取请求体内容，可指定属性 @Body('id')
  // @Headers() 获取请求头
  // @Res() 处理响应，如res.redirect('url')
  async getUserById(
    @Headers() header,
    @Res() res,
    @Body() params: RegisterDto
  ) {
    /** ... */
  }

  // 携带参数
  @Get(":id")
  // 获取请求地址query中的id
  async getUserById(@Param("id") id) {
    /** ... */
  }
}
```

### 全局路由前缀

```ts
// main.ts
// ...
async fucntion bootstrap() {
	const app = await NestFactory.create(AppModule);
	// ...
	app.setGlobalPrefix('api/v1')
}
bootstrap()
```

# nest-cli生成模板代码

- 创建模块: `nest g [文件类型] [文件名] [文件目录]`，如 `nest g mo posts`
- 创建控制器：`nest g co posts`
- 创建服务类：`nest g service posts`

# 登录&认证

### JWT登录

### 微信登录

### 密码加密

bcryptjs

# 统一请求响应

### 请求失败响应

- 创建过滤器：`nest g filter core/filter/http-exception`

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? "Service Error" : "Client Error"}`;
    const errorResponse = {
      data: {},
      message: message,
      code: -1
    }; // 设置返回的状态码， 请求头，发送错误信息

    response.status(status);
    response.header("Content-Type", "application/json; charset=utf-8");
    response.send(errorResponse);
  }
}
```

### 请求成功响应

- 创建拦截器：`nest g interceptor core/interceptor/transform`

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return {
          data,
          code: 0,
          msg: "请求成功"
        };
      })
    );
  }
}
```

# 接口文档

### 安装swagger

`npm install @nestjs/swagger swagger-ui-express -S`

### 注册swagger

```ts
// main.ts
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  // ...
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle("管理后台")
    .setDescription("管理后台接口文档")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config); // 访问接口文档路由为 /docs
  SwaggerModule.setup("docs", app, document);

  await app.listen(9080);
}
bootstrap();
```

### 接口说明

- 接口标题：每个Controller添加`@ApiTags("这是接口简介")`
- 接口简介：每个路由方法添加`@ApiOperation("这是接口说明")`
- 接口参数说明：每个路由方法参数添加DTO，每个DTO参数添加`@ApiProperty(options)`或`@ApiPropertyOptional(options)`

# 参数校验

### 参数格式校验

- 安装：`npm install class-validator -S`
- 使用：

```ts
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ description: "文章标题" })
  @IsNotEmpty({ message: "文章标题必填" })
  readonly title: string;

  @ApiProperty({ description: "文章类型" })
  @IsNumber()
  readonly type: number;
}
```

### 参数缺失

### 参数转换

- 安装：`npm install class-transformer -S`

### 注册参数校验管道

```ts
import { ValidationPipe } from "@nestjs/common";

function bootstrap() {
  // ...
  app.useGlobalPipes(new ValidationPipe());
}

bootstrap();
```
