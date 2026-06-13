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
import { AddressService } from "./address.service";
import { CreateAddressDTO } from "./dto/create-address.dto";
import { UpdateAddressDTO } from "./dto/update-address.dto";
import { ResponseAddressDTO } from "./dto/response-address.dto";
import { AddressContract } from "@interfaces/address.contract";

@Controller("addresses")
export class AddressController {
  constructor(
    @Inject(AddressService) private _addressService: AddressService
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createAddressDTO: CreateAddressDTO
  ): Promise<CreateDefaultResponseDTO> {
    return this._addressService.create(createAddressDTO);
  }

  @Get()
  async findAll(
    @Query() query: Partial<AddressContract>
  ): Promise<ResponseAddressDTO[]> {
    return this._addressService.findAll(query);
  }

  @Put()
  async update(
    @Body() updateAddressDTO: UpdateAddressDTO
  ): Promise<UpdateDefaultResponseDTO> {
    return this._addressService.update(updateAddressDTO);
  }

  @Delete()
  async delete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<DeleteDefaultResponseDTO> {
    return this._addressService.delete(ids);
  }

  @Delete("/hardDelete")
  async hardDelete(
    @Query("ids") ids: number[]
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._addressService.hardDelete(ids);
  }
}
