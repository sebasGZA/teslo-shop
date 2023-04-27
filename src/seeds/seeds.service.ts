import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedsService {

  constructor(private productsService: ProductsService) { }

  async executeSeed() {
    await this.insertNewProducts();
    return `SEED executed`;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    return true
  }
}
