import { Body, Controller, Delete, Get, Inject, ParseArrayPipe, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { AuditContract } from "../common/contracts/audit.contract";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "../common/dto/hard-delete-default-response.dto";
import { CompaniesService } from "./companies.service";
import { ResponseCompanyDTO } from "./dto/response-companies.dto";
import { UpdateCompanyDTO } from "./dto/update-companies.dto";
import { CompanyContract } from "@interfaces/company.contract";
import { CreateCompanyDTO } from "./dto/create-companies.dto";

@Controller("companies")
export class CompaniesController{

  constructor(
    @Inject(CompaniesService) private _companiesService: CompaniesService
  ){}

  @Post()
  async create(@Body(new ValidationPipe({ transform: true })) createProductDTO: CreateCompanyDTO): Promise<CreateDefaultResponseDTO>{
    return this._companiesService.create(createProductDTO);
  }

  @Get()
  async findAll(@Query() query: CompanyContract & AuditContract): Promise<ResponseCompanyDTO[]>{
    return this._companiesService.findAll(query);
  }

  @Put()
  async update(@Body() updateProductDTO: UpdateCompanyDTO): Promise<UpdateDefaultResponseDTO> {
    return this._companiesService.update(updateProductDTO);
  }

  @Delete()
  async delete(
    @Query(
      "ids", 
      new ParseArrayPipe({ items:Number, separator:","})
    ) ids: number[]
    ): Promise<DeleteDefaultResponseDTO>{
    return this._companiesService.delete(ids);
  }

  @Delete("/hardDelete")
  async hardDelete(@Query("ids") ids: number[]): Promise<HardDeleteDefaultResponseDTO>{

    return this._companiesService.hardDelete(ids);
  }
}
