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
import { AuditContract } from "@api/common/contracts/audit.contract";
import { RoleContract } from "@interfaces/role.contract";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { ResponseRoleDTO } from "./dto/response-role.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { RolesService } from "./roles.service";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";
import { DeleteDefaultResponseDTO } from "@interfaces/delete-default-response.dto";
import { HardDeleteDefaultResponseDTO } from "@interfaces/hard-delete-default-response.dto";
import { Permissions } from "@api/iam/authorization/decorators/permissions.decorator";
import { PERMISSION_CODES } from "@interfaces/permission-code.contract";

@Controller("roles")
export class RolesController {
  constructor(@Inject(RolesService) private _rolesService: RolesService) {}

  @Post()
  @Permissions(PERMISSION_CODES.ROLE_CREATE)
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createRoleDTO: CreateRoleDTO
  ): Promise<CreateDefaultResponseDTO> {
    return this._rolesService.create(createRoleDTO);
  }

  @Get()
  @Permissions(PERMISSION_CODES.ROLE_READ)
  async findAll(
    @Query() query: Partial<RoleContract & AuditContract>
  ): Promise<ResponseRoleDTO[]> {
    return this._rolesService.findAll(query);
  }

  @Put()
  @Permissions(PERMISSION_CODES.ROLE_UPDATE)
  async update(
    @Body(new ValidationPipe({ transform: true }))
    updateRoleDTO: UpdateRoleDTO
  ): Promise<UpdateDefaultResponseDTO> {
    return this._rolesService.update(updateRoleDTO);
  }

  @Delete()
  @Permissions(PERMISSION_CODES.ROLE_DELETE)
  async delete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<DeleteDefaultResponseDTO> {
    return this._rolesService.delete(ids);
  }

  @Delete("/hardDelete")
  @Permissions(PERMISSION_CODES.ROLE_DELETE)
  async hardDelete(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
    ids: number[]
  ): Promise<HardDeleteDefaultResponseDTO> {
    return this._rolesService.hardDelete(ids);
  }
}
