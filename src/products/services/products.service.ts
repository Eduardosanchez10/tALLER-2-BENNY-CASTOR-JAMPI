import { Category } from './../interfaces/category.interface';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from '../dto/product/update-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { PaginationDto } from '../../common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from '../interfaces/response-products.interface';
import { ManagerError } from 'src/common/errors/manage.error';
import { CreateProductDto } from '../dto/product/create-product.dto';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from './category.service';

@Injectable()
export class ProductsService {
  constructor(private readonly   categoryService:CategoryService){ }

  private product: ProductEntity[] = []
  create(createProductDto: CreateProductDto) {
    try {
      const product: ProductEntity = {
        ...createProductDto,
        isActive: true,
        id: this.product.length+1,
        
      }
      if( !product ){
        throw new BadRequestException("Product not create!");
      }
  
      this.product.push(product); 
      return product
    } catch (error) {
      throw new InternalServerErrorException("500 Server Error");
    }
  }

  async findAll( paginationDto: PaginationDto):Promise< ResponseAllProducts > {
    try {

      if( this.product.length === 0 ){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Products not found!"
        });
      }
    
      const { page, limit } = paginationDto;
      const total = this.product.filter((product) => product.isActive===true).length

      const skip = ( page - 1 ) * limit;

      const lastPage = Math.ceil(total / limit);
      
      const data = this.product.slice( skip, limit );

      return {
        page,
        lastPage,
        total,
        limit,
        data
      }
      
    } catch (error) {
      ManagerError.createSignatureError( error.message )
    }
  }

  findOne(id: number) {
    try{
      const product = this.product.find(product => product.id === id && product.isActive === true)
      if(!product) throw new NotFoundException('Product not found')
      
        const category = this.categoryService.findOne
      return  category &&  product
    }catch(error){
      throw new InternalServerErrorException('500 Server Error')
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try { 
      let productDB = this.product.find(product => product.id === id)
      
      this.product = this.product.map(product => {
        if(product.id === id){
          productDB = {
            ...productDB,
            ...updateProductDto
          }
          return productDB
        }
        return product;
      })
  }
  catch{
    throw new InternalServerErrorException('500 Server Error')
  }
}

  delete(id: number) {
    try {
      const productDB = this.product.findIndex((product )=> product.id === id)
      if( productDB === -1){
        throw new ManagerError({
          type: "NOT_FOUND",
          message: "Products not found!"
        });
      }
      this.product[productDB] = {
        ...this.product[productDB],
        isActive:false
      }
      
      return 'Producto Eliminad';
    } catch (error) {
      throw new InternalServerErrorException('500 Server Error')
    }
  }
}
