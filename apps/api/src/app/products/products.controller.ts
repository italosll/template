import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "@interfaces/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "@interfaces/hard-delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ResponseProductDTO } from "./dto/response-product.dto";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(
    @Inject(ProductsService) private _productsService: ProductsService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createProductDTO: CreateProductDTO,
  ): Promise<CreateDefaultResponseDTO> {
    return this._productsService.create(createProductDTO);
  }

  @Get()
  async findAll(
    @Query() query: { pesquisar?: string; id: number },
  ): Promise<ResponseProductDTO[]> {
    return this._productsService.findAll({
      textToSearch: query.pesquisar,
      id: query.id,
    });
  }

  @Put()
  async update(
    @Body() updateProductDTO: UpdateProductDTO,
  ): Promise<UpdateDefaultResponseDTO> {
    return this._productsService.update(updateProductDTO);
  }

  @Delete()
  async delete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[],
  ): Promise<DeleteDefaultResponseDTO> {
    return this._productsService.delete(ids);
  }

  @Delete("/hardDelete")
  async hardDelete(
    @Query("ids") ids: number[],
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._productsService.hardDelete(ids);
  }
}
