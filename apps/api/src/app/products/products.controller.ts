import { Body, Controller, Delete, Get, Inject, ParseArrayPipe, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AuditContract } from "../common/contracts/audit.contract";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { HardDeleteDefaultResponseDTO } from "../common/dto/hard-delete-default-response.dto";
import { ProductContract } from "@interfaces/product.contract";
import { Product } from "./entities/product.entity";

@Controller("products")
export class ProductsController{

  constructor(@Inject(ProductsService) private _productsService: ProductsService){}

  @Post()
  async create(@Body(new ValidationPipe({ transform: true })) createProductDTO: CreateProductDTO): Promise<CreateDefaultResponseDTO>{
    return this._productsService.create(createProductDTO);
  }

  @Get()
  async findAll(@Query() query: ProductContract & AuditContract): Promise<Product[]>{
    return this._productsService.findAll(query);
  }

  @Put()
  async update(@Body() updateProductDTO: UpdateProductDTO): Promise<UpdateDefaultResponseDTO> {
    return this._productsService.update(updateProductDTO);
  }

  @Delete()
  async delete(
    @Query(
      "ids", 
      new ParseArrayPipe({ items:Number, separator:","})
    ) ids: number[]
    ): Promise<DeleteDefaultResponseDTO>{
    return this._productsService.delete(ids);
  }

  @Delete("/hardDelete")
  async hardDelete(@Query("ids") ids: number[]): Promise<HardDeleteDefaultResponseDTO>{

    return this._productsService.hardDelete(ids);
  }
}
