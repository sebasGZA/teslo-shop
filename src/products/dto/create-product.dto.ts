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

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    example: 'onion',
  })
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    example: 1500,
  })
  price?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'clothes',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'shirt',
  })
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({
    example: 15,
  })
  stock?: number;

  @IsString({
    each: true,
  })
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  @ApiPropertyOptional({
    example: ['men'],
  })
  gender: string;

  @IsString({
    each: true,
  })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: ['clothes'],
  })
  tags?: string[];

  @IsString({
    each: true,
  })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: ['yourimage.jpg'],
  })
  images?: string[];
}
