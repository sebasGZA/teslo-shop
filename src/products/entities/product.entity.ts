import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEnum } from '../enums/product.enum';

@Entity({
  name: 'products',
})
export class Product {
  @ApiProperty({
    example: ProductEnum.ID_EXAMPLE,
    description: ProductEnum.ID_DESCRIPTION,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: ProductEnum.TITLE_EXAMPLE,
    description: ProductEnum.TITLE_DESCRIPTION,
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: +ProductEnum.PRICE_EXAMPLE,
    description: ProductEnum.PRICE_DESCRIPTION,
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    default: null,
    description: ProductEnum.DESCRIPTION,
    example: ProductEnum.DESCRIPTION_EXAMPLE,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    uniqueItems: true,
    description: ProductEnum.SLUG_DESCRIPTION,
    example: ProductEnum.SLUG_EXAMPLE,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    description: ProductEnum.STOCK_DESCRIPTION,
    example: +ProductEnum.STOCK_EXAMPLE,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: ProductEnum.SIZES_DESCRIPTION,
    isArray: true,
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: ProductEnum.GENDER_EXAMPLE,
    description: ProductEnum.GENDER_DESCRIPTION,
    isArray: true,
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['mem'],
    description: ProductEnum.TAGS_DESCRIPTION,
    isArray: true,
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, {
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (this.title) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
