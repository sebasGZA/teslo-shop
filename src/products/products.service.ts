import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  readonly #logger: Logger;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    this.#logger = new Logger(ProductsService.name);
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      const productCreated = await this.productRepository.save(product);
      return productCreated;
    } catch (error: any) {
      this.#handleDbExceptions(error);
    }
  }

  findAll() {
    return this.productRepository.find({});
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  #handleDbExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.#logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
