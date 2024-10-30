import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controller/products.controller';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controller/category.controller';

@Module({
  controllers: [ProductsController,CategoryController],
  providers: [ProductsService,CategoryService],
})
export class ProductsModule {}
