import { Module, NestModule, RequestMethod, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReverseProxyMiddleware } from './reverse-proxy.middleware';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer) {
    consumer
      .apply(ReverseProxyMiddleware)
      .forRoutes({ path: 'v2/products-api', method: RequestMethod.ALL });
  }
}
