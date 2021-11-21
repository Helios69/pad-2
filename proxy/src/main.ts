import { NestFactory } from '@nestjs/core';
import * as proxy from 'http-proxy-middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(
    '/api/v1/products-api',
    proxy({
      target: 'http://localhost:8090',
      pathRewrite: {
        '/api/v1/products-api': '',
      },
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log(proxyReq);
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
