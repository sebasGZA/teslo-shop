import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as IsUUID } from 'uuid';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
  readonly #logger: Logger;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {
    this.#logger = new Logger(ProductsService.name);
  }

  async create({ images = [], ...createDto }: CreateProductDto) {
    try {
      const product = this.productRepository.create({
        ...createDto,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      const productCreated = await this.productRepository.save(product);
      return { ...productCreated, images };
    } catch (error: any) {
      this.#handleDbExceptions(error);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    return products.map(({ images, ...product }) => ({
      ...product,
      images: images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;
    if (IsUUID(term))
      product = await this.productRepository.findOneBy({ id: term });
    else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title OR slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  async update(id: string, { images, ...updateDto }: UpdateProductDto) {
    const productDb = await this.productRepository.preload({
      id,
      ...updateDto,
    });
    if (!productDb)
      throw new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        productDb.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      await queryRunner.manager.save(productDb);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(productDb.id);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.#handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return query.delete().where({}).execute();
    } catch (error: any) {
      this.#handleDbExceptions(error);
    }
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map((image) => image.url),
    };
  }

  #handleDbExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.#logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
