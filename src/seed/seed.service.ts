import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { initialData, SeedData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {
  #seedData: SeedData;
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.#seedData = initialData();
  }

  async runSeed() {
    await this.#deleteTables();
    const adminUser = await this.#insertUsers();
    await this.#insertNewProducts(adminUser);
    return `Seeds executed`;
  }

  async #deleteTables() {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  async #insertUsers() {
    const seedUsers = this.#seedData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => [users.push(this.userRepository.create(user))]);
    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }

  async #insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();

    const products = this.#seedData.products;

    const insertPromises = [];
    products.forEach((product) =>
      insertPromises.push(this.productService.create(product, user)),
    );
    await Promise.all(insertPromises);
    return true;
  }
}
