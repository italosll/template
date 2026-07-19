import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { AssignmentsService } from "./assignments.service";
import { AssignRoleDto } from "./dto/assign-role.dto";
import { AssignPermissionDto } from "./dto/assign-permission.dto";
import { Permissions } from "./decorators/permissions.decorator";
import { PERMISSION_CODES } from "@api/iam/permissions/permissions.constant";
import { AuthorizationService } from "./authorization.service";

@Controller("authorization")
export class AuthorizationController {
  constructor(
    private readonly _assignmentsService: AssignmentsService,
    private readonly _authorizationService: AuthorizationService
  ) {}

  @Post("roles")
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async assignRole(
    @Body(new ValidationPipe({ transform: true })) dto: AssignRoleDto
  ) {
    return this._assignmentsService.assignRole(dto);
  }

  @Delete("roles")
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async revokeRole(
    @Query("userId", ParseIntPipe) userId: number,
    @Query("roleId", ParseIntPipe) roleId: number,
    @Query("tenantId") tenantId?: string
  ) {
    const scope =
      tenantId === undefined || tenantId === ""
        ? null
        : Number.parseInt(tenantId, 10);
    await this._assignmentsService.revokeRole(userId, roleId, scope);
    return { success: true };
  }

  @Post("permissions")
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async assignPermission(
    @Body(new ValidationPipe({ transform: true })) dto: AssignPermissionDto
  ) {
    return this._assignmentsService.assignPermission(dto);
  }

  @Delete("permissions")
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async revokePermission(
    @Query("userId", ParseIntPipe) userId: number,
    @Query("permissionId", ParseIntPipe) permissionId: number,
    @Query("tenantId") tenantId?: string
  ) {
    const scope =
      tenantId === undefined || tenantId === ""
        ? null
        : Number.parseInt(tenantId, 10);
    await this._assignmentsService.revokePermission(
      userId,
      permissionId,
      scope
    );
    return { success: true };
  }

  @Get("users/:userId/roles")
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async listRoleAssignments(@Param("userId", ParseIntPipe) userId: number) {
    return this._assignmentsService.listUserRoleAssignments(userId);
  }

  @Get("users/:userId/permissions")
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async listPermissionAssignments(
    @Param("userId", ParseIntPipe) userId: number
  ) {
    return this._assignmentsService.listUserPermissionAssignments(userId);
  }

  @Get("users/:userId/effective")
  @Permissions(PERMISSION_CODES.PERMISSION_MANAGE)
  async getEffectivePermissions(
    @Param("userId", ParseIntPipe) userId: number,
    @Query("tenantId", ParseIntPipe) tenantId: number
  ) {
    const permissions =
      await this._authorizationService.getEffectivePermissions(
        userId,
        tenantId
      );
    return { permissions: [...permissions] };
  }
}
