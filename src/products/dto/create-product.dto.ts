import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ProductEnum } from '../enums/product.enum';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: ProductEnum.TITLE_EXAMPLE,
    description: ProductEnum.TITLE_DESCRIPTION,
  })
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    example: +ProductEnum.PRICE_EXAMPLE,
    description: ProductEnum.PRICE_DESCRIPTION,
  })
  price?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: ProductEnum.DESCRIPTION_EXAMPLE,
    description: ProductEnum.DESCRIPTION,
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: ProductEnum.SLUG_EXAMPLE,
    description: ProductEnum.SLUG_DESCRIPTION,
  })
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    example: +ProductEnum.STOCK_EXAMPLE,
    description: ProductEnum.STOCK_DESCRIPTION,
  })
  stock?: number;

  @IsString({
    each: true,
  })
  @IsArray()
  @ApiProperty({
    example: ['M'],
    description: ProductEnum.SIZES_DESCRIPTION,
  })
  sizes: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  @ApiPropertyOptional({
    example: ['men'],
    description: ProductEnum.GENDER_DESCRIPTION,
  })
  gender: string;

  @IsString({
    each: true,
  })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: ['clothes'],
    description: ProductEnum.TAGS_DESCRIPTION,
  })
  tags?: string[];

  @IsString({
    each: true,
  })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: ['yourimage.jpg'],
    description: ProductEnum.IMAGES_DESCRIPTION,
    isArray: true,
  })
  images?: string[];
}
