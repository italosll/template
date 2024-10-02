import { Body, Controller, Delete, Get, Inject, Patch, Post, Query } from "@nestjs/common";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserContract } from "@template/interfaces";
import { AuditContract } from "../common/contracts/audit.contract";

@Controller("users")
export class UsersController{

  constructor(@Inject(UsersService) private _usersService: UsersService ){}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<CreateDefaultResponseDTO>{
    return this._usersService.create(createUserDTO);
  }

  @Get()
  async findAll(@Query() query:UserContract & AuditContract): Promise<UpdateUserDTO[]>{
    return this._usersService.findAll(query);
  }

  @Patch()
  async update(@Body() updateUserDTO: UpdateUserDTO): Promise<UpdateDefaultResponseDTO> {
    return this._usersService.update(updateUserDTO);
  }

  @Delete()
  delete(@Query("id") id: number): Promise<DeleteDefaultResponseDTO>{
    return this._usersService.delete(id);
  }

  @Delete("/hardDelete")
  hardDelete(@Query("id") id: number): Promise<DeleteDefaultResponseDTO>{
    return this._usersService.hardDelete(id);
  }
}
