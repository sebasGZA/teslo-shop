import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { Auth, GetUser } from '../auth/decorators';
import { ProductsService } from './products.service';
import { User } from '../auth/entities/user.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { Product } from './entities';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.user)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product was created',
    type: Product,
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products found',
    type: Product,
    isArray: true,
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product found',
    type: Product,
  })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated',
    type: Product,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
