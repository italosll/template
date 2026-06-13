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
import { CreateDefaultResponseDTO } from "../../../../../libs/interfaces/src/lib/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "../../../../../libs/interfaces/src/lib/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "../../../../../libs/interfaces/src/lib/hard-delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "../../../../../libs/interfaces/src/lib/update-default-response.dto";
import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { CreateServiceOrderDTO } from "./dto/create-service-order.dto";
import { ResponseServiceOrderDTO } from "./dto/response-service-order.dto";
import { UpdateServiceOrderDTO } from "./dto/update-service-order.dto";
import { ServiceOrderService } from "./service-order.service";

@Controller("service-orders")
export class ServiceOrderController {
  constructor(
    @Inject(ServiceOrderService)
    private _serviceOrderService: ServiceOrderService
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createServiceOrderDTO: CreateServiceOrderDTO
  ): Promise<CreateDefaultResponseDTO> {
    return this._serviceOrderService.create(createServiceOrderDTO);
  }

  @Get()
  async findAll(
    @Query() query: Partial<ServiceOrderContract>
  ): Promise<ResponseServiceOrderDTO[]> {
    return this._serviceOrderService.findAll(query);
  }

  @Put()
  async update(
    @Body() updateServiceOrderDTO: UpdateServiceOrderDTO
  ): Promise<UpdateDefaultResponseDTO> {
    return this._serviceOrderService.update(updateServiceOrderDTO);
  }

  @Delete()
  async delete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<DeleteDefaultResponseDTO> {
    return this._serviceOrderService.delete(ids);
  }

  @Delete("/hardDelete")
  async hardDelete(
    @Query("ids") ids: number[]
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._serviceOrderService.hardDelete(ids);
  }
}
