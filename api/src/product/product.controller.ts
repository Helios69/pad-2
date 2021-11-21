import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Inject,
  CACHE_MANAGER,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import { CreateProductDto, ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly productsService: ProductService,
  ) {}

  @Get()
  async getAllProducts(@Req() req: Request) {
    const key = req.path;
    const data = await this.cacheManager.get(key);
    if (!data) {
      const products = await this.productsService.getAllProducts();
      await this.cacheManager.set(key, products, { ttl: 1000 });

      return products;
    }

    return data;
  }

  @Get(':id')
  async getProductById(@Param('id') id: number, @Req() req: Request) {
    const key = req.path;
    const data = await this.cacheManager.get(key);
    console.log(key, data);

    if (!data) {
      const product = await this.productsService.getProductById(id);
      await this.cacheManager.set(key, product, { ttl: 1000 });

      return product;
    }

    return data;
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
  ) {
    await this.cacheManager.del(req.path);
    console.log(req.path);

    return this.productsService.createProduct(createProductDto);
  }

  @Patch(':id')
  async modifyProduct(
    @Param('id') id: number,
    @Body() modifyProductDto: Partial<CreateProductDto>,
    @Req() req: Request,
  ) {
    const key = req.path;
    const updatedProd = await this.productsService.modifyProduct(
      id,
      modifyProductDto,
    );
    await this.cacheManager.set(key, updatedProd, { ttl: 1000 });

    return updatedProd;
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: number, @Req() req: Request) {
    await this.cacheManager.del(req.path);
    return this.productsService.removeProduct(id);
  }
}
