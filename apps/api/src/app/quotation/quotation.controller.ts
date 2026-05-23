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
import { CreateDefaultResponseDTO } from "@api/common/dto/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "@api/common/dto/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "@api/common/dto/hard-delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "@api/common/dto/update-default-response.dto";
import { CreateQuotationDTO } from "./dto/create-quotation.dto";
import { ResponseQuotationDTO } from "./dto/response-quotation.dto";
import { UpdateQuotationDTO } from "./dto/update-quotation.dto";
import { QuotationService } from "./quotation.service";

@Controller("quotations")
export class QuotationController {
  constructor(
    @Inject(QuotationService) private _quotationService: QuotationService
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createQuotationDTO: CreateQuotationDTO
  ): Promise<CreateDefaultResponseDTO> {
    return this._quotationService.create(createQuotationDTO);
  }

  @Get()
  async findAll(
    @Query() query: { textToSearch?: string; id?: number }
  ): Promise<ResponseQuotationDTO[]> {
    return this._quotationService.findAll(query);
  }

  @Put()
  async update(
    @Body() updateQuotationDTO: UpdateQuotationDTO
  ): Promise<UpdateDefaultResponseDTO> {
    return this._quotationService.update(updateQuotationDTO);
  }

  @Delete()
  async delete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<DeleteDefaultResponseDTO> {
    return this._quotationService.delete(ids);
  }

  @Delete("/hardDelete")
  async hardDelete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._quotationService.hardDelete(ids);
  }
}
