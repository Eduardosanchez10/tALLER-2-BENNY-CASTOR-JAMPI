import { Category } from './../products/interfaces/category.interface';
import { Module } from '@nestjs/common';
import { CategoryController } from 'src/products/controller/category.controller';
import { ProductsController } from 'src/products/controller/products.controller';
import { CategoryService } from 'src/products/services/category.service';
import { ProductsService } from 'src/products/services/products.service';

@Module({
    controllers: [CategoryController,ProductsController],
    providers: [CategoryService,ProductsService],
  })
  export class CategoryModule {}
