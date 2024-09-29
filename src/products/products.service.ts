import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { validate as IsUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

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

  findAll({ limit = 10, offset = 0 }: PaginationDto) {
    return this.productRepository.find({ take: limit, skip: offset });
  }

  async findOne(term: string) {
    let product: Product;
    if (IsUUID(term))
      product = await this.productRepository.findOneBy({ id: term });
    else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title) =:title OR slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }
    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productDb = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!productDb)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      const productUpdated = await this.productRepository.save(productDb);
      return productUpdated;
    } catch (error: any) {
      this.#handleDbExceptions(error);
    }
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
