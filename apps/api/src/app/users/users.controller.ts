import { UserContract } from "@interfaces/user.contract";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { AuditContract } from "../common/contracts/audit.contract";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "../common/dto/hard-delete-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { responseUserDTO } from "./dto/response-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(@Inject(UsersService) private _usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDTO: CreateUserDTO
  ): Promise<CreateDefaultResponseDTO> {
    return this._usersService.create(createUserDTO);
  }

  @Get()
  async findAll(
    @Query() query: UserContract & AuditContract
  ): Promise<responseUserDTO[]> {
    return this._usersService.findAll(query);
  }

  @Patch()
  async update(
    @Body() updateUserDTO: UpdateUserDTO
  ): Promise<UpdateDefaultResponseDTO> {
    return this._usersService.update(updateUserDTO);
  }

  @Delete()
  delete(@Query("ids") ids: number[]): Promise<DeleteDefaultResponseDTO> {
    return this._usersService.delete(ids);
  }

  @Delete("/hardDelete")
  hardDelete(
    @Query("ids") ids: number[]
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._usersService.hardDelete(ids);
  }
}
