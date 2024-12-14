import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { User } from '../auth/entities/user.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, TypeOrmModule.forFeature([User])],
})
export class SeedModule {}
