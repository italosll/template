import { Body, Controller, Delete, Get, Inject, Patch, Post, Query } from "@nestjs/common";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateDefaultResponseDTO } from "../common/dto/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "../common/dto/update-default-response.dto";
import { DeleteDefaultResponseDTO } from "../common/dto/delete-default-response.dto";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserContract } from "@template/interfaces";
import { AuditContract } from "../common/contracts/audit.contract";
import { HardDeleteDefaultResponseDTO } from "../common/dto/hard-delete-default-response.dto";

@Controller("users")
export class UsersController{

  constructor(@Inject(UsersService) private _usersService: UsersService ){}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<CreateDefaultResponseDTO>{

    console.log("----------")
    console.log(createUserDTO)
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
  delete(@Query("ids") ids: number[]): Promise<DeleteDefaultResponseDTO>{
    return this._usersService.delete(ids);
  }

  @Delete("/hardDelete")
  hardDelete(@Query("ids") ids: number[]): Promise<HardDeleteDefaultResponseDTO>{
    return this._usersService.hardDelete(ids);
  }
}
