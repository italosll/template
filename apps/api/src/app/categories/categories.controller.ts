import { ProductContract } from "@interfaces/product.contract";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { AuditContract } from "../common/contracts/audit.contract";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "../common/dto/hard-delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { UpdateCategoryDTO } from "./dto/update-category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(
    @Inject(CategoriesService) private _categoriesService: CategoriesService
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createCategoryDTO: CreateCategoryDTO
  ): Promise<CreateDefaultResponseDTO> {
    return this._categoriesService.create(createCategoryDTO);
  }

  @Get()
  async findAll(
    @Query() query: Partial<ProductContract & AuditContract>
  ): Promise<UpdateCategoryDTO[]> {
    return this._categoriesService.findAll(query);
  }

  @Put()
  async update(
    @Body() updateProductDTO: UpdateCategoryDTO
  ): Promise<UpdateDefaultResponseDTO> {
    return this._categoriesService.update(updateProductDTO);
  }

  @Delete()
  delete(@Query("ids") ids: number[]): Promise<DeleteDefaultResponseDTO> {
    return this._categoriesService.delete(ids);
  }

  @Delete("/hardDelete")
  hardDelete(
    @Query("ids") ids: number[]
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._categoriesService.hardDelete(ids);
  }
}
