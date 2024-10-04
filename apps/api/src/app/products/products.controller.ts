import { Body, Controller, Delete, Get, Inject, Post, Put, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AuditContract } from "../common/contracts/audit.contract";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { CreateProductDTO } from "./dto/create-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { HardDeleteDefaultResponseDTO } from "../common/dto/hard-delete-default-response.dto";
import { ProductContract } from "@template/interfaces";

@Controller("products")
export class ProductsController{

  constructor(@Inject(ProductsService) private _productsService: ProductsService){}

  @Post()
  async create(@Body() createProductDTO: CreateProductDTO): Promise<CreateDefaultResponseDTO>{
    return this._productsService.create(createProductDTO);
  }

  @Get()
  async findAll(@Query() query: ProductContract & AuditContract): Promise<UpdateProductDTO[]>{
    return this._productsService.findAll(query);
  }

  @Put()
  async update(@Body() updateProductDTO: UpdateProductDTO): Promise<UpdateDefaultResponseDTO> {
    return this._productsService.update(updateProductDTO);
  }

  @Delete()
  delete(@Query("ids") ids: number[]): Promise<DeleteDefaultResponseDTO>{
    return this._productsService.delete(ids);
  }

  @Delete("/hardDelete")
  hardDelete(@Query("id") id: number): Promise<HardDeleteDefaultResponseDTO>{
    return this._productsService.hardDelete(id);
  }
}
