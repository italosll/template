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

import { ClientService } from "./client.service";
import { CreateClientDTO } from "./dto/create-client.dto";
import { ResponseClientDTO } from "./dto/response-client.dto";
import { UpdateClientDTO } from "./dto/update-client.dto";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";
import { DeleteDefaultResponseDTO } from "@interfaces/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "@interfaces/hard-delete-default-response.dto";

@Controller("clients")
export class ClientController {
  constructor(@Inject(ClientService) private _clientService: ClientService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createClientDTO: CreateClientDTO
  ): Promise<CreateDefaultResponseDTO> {
    return this._clientService.create(createClientDTO);
  }

  @Get()
  async findAll(
    @Query() query: { textToSearch?: string; id?: number }
  ): Promise<ResponseClientDTO[]> {
    return this._clientService.findAll(query);
  }

  @Put()
  async update(
    @Body() updateClientDTO: UpdateClientDTO
  ): Promise<UpdateDefaultResponseDTO> {
    return this._clientService.update(updateClientDTO);
  }

  @Delete()
  async delete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<DeleteDefaultResponseDTO> {
    return this._clientService.delete(ids);
  }

  @Delete("/hardDelete")
  async hardDelete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._clientService.hardDelete(ids);
  }
}
