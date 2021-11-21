import { NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as proxy from 'http-proxy-middleware';

export class ReverseProxyMiddleware implements NestMiddleware {
  private proxy = proxy({
    target: 'http://localhost:8090/api',
    pathRewrite: {
      '/api/v2/products-api': '',
    },
    secure: false,
    onProxyReq: (proxyReq, req, res) => {},
  });

  constructor() {}

  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}
