import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { Permissions } from "@api/iam/authorization/decorators/permissions.decorator";
import { PERMISSION_CODES } from "@interfaces/permission-code.contract";

@Controller("permissions")
export class PermissionsController {
  constructor(private readonly _permissionsService: PermissionsService) {}

  @Get()
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async findAll() {
    return this._permissionsService.findAll();
  }

  @Post()
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async create(
    @Body(new ValidationPipe({ transform: true })) dto: CreatePermissionDto
  ) {
    return this._permissionsService.create(dto);
  }
}
