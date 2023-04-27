import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedsService {

  constructor(private productsService: ProductsService) { }

  async executeSeed() {
    await this.insertNewProducts();
    return `SEED executed`;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    const seedProducts = initialData.products;
    const insertPromises = [];
    seedProducts.forEach(product => {
      insertPromises.push(
        this.productsService.create(product),
      )
    });

    await Promise.all(insertPromises);
    return true
  }
}
