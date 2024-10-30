import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CategoryEntity } from "../entities/category.entity";
import { CreateCategoryDto } from "../dto/category/create-category.dto";
import { ManagerError } from "src/common/errors/manage.error";
import { error } from "console";
import { UpdateCategoryDto } from "../dto/category/update-product.dto";
import { PaginationDto } from "src/common/dtos/pagination/pagination.dto";
import { ResponseAllProducts } from "../interfaces/response-products.interface";

@Injectable()
export class CategoryService{
  private categories:CategoryEntity[]  =[
    {id:1 , name:" xddd", description:"xdddddd", isActive:true}
  ]
    create(createCategoryDto : CreateCategoryDto){
        try{
            const category : CategoryEntity ={
                ...createCategoryDto,
                isActive:true,
                id: this.categories.length+1, 
            } 
            if( !category ){
                throw new ManagerError({
                    type: "NOT_FOUND",
                    message:" category not create!"
                });
            }
            this.categories.push(category)
            return category
        } catch (error){
            ManagerError.createSignatureError(error.message)
        }
    }
    findOne(id: number) {
        try{
          const category = this.categories.find(category => category.id === id && category.isActive === true)
          if(!category) { throw new ManagerError({
            type: "NOT_FOUND",
            message:" category not Found!"
        });}
          return category;
        }catch(error){
            ManagerError.createSignatureError(error.message)
         
        }
      }
      async findAll( paginationDto: PaginationDto):Promise< ResponseAllProducts > {
        try {
    
          if( this.categories.length === 0 ){
            throw new ManagerError({
              type: "NOT_FOUND",
              message: "category not found!"
            });
          }
        
          const { page, limit } = paginationDto;
          const total = this.categories.filter((category) => category.isActive===true).length
    
          const skip = ( page - 1 ) * limit;
    
          const lastPage = Math.ceil(total / limit);
          
          const data = this.categories.slice( skip, limit );
    
          return {
            page,
            lastPage,
            total,
            limit,
            data:[],
          }
          
        } catch (error) {
          ManagerError.createSignatureError( error.message )
        }
      }
      update(id: number, updateCategoryDto: UpdateCategoryDto) {
        try { 
          let categoryDB = this.categories.find(category => category.id === id)
          
          this.categories = this.categories.map(category => {
            if(category.id === id){
              categoryDB = {
                ...categoryDB,
                ...updateCategoryDto
              }
              return categoryDB
            }
            return category;
          })
      }
      catch{
        throw new InternalServerErrorException('500 Server Error')
      }
    }
    delete(id: number) {
        try {
          const categoryDB = this.categories.find(category => category.id === id)
          if(!categoryDB)  throw new ManagerError({
            type: "NOT_FOUND",
            message:" Category not create!"
        });
          this.categories = this.categories.filter(category => category.id !== id)
    
          return 'Category Delete'
        } catch (error) {
          throw  ManagerError.createSignatureError(error.message)
        }
      }
}