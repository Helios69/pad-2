import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

export interface CreateProductDto {
  productName: string;
  productDescription?: string;
  price: number;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const product = this.productsRepository.findOne(id);
      if (!product) throw new NotFoundException('Product not found.');

      return product;
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);

      return product;
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async modifyProduct(
    id: number,
    modifyProductDto: Partial<CreateProductDto>,
  ): Promise<Product> {
    try {
      const product = await this.productsRepository.preload({
        id: +id,
        ...modifyProductDto,
      });
      await this.productsRepository.save(product);

      return product;
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async removeProduct(id: number): Promise<number> {
    try {
      await this.productsRepository.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
