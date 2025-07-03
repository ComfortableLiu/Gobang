import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from "./interceptors/exception.filter";
import { SignatureInterceptor } from "./interceptors/signature.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 验签拦截器
  app.useGlobalInterceptors(new SignatureInterceptor());
  // 全局错误过滤器
  app.useGlobalFilters(new AllExceptionsFilter())

  // 全局路由前缀
  app.setGlobalPrefix('api')

  // 跨域，用默认就好
  app.enableCors()

  await app.listen(process.env.PORT ?? 3001)
}

bootstrap().then()
