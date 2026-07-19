import { REQUEST_USER_KEY } from "@api/iam/iam.constants";
import { ActiveUserContract } from "@interfaces/active-user.contract";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PERMISSIONS_KEY } from "../authorization.constants";
import { AuthorizationService } from "../authorization.service";
import { UserPermissionAssignment } from "../entities/user-permission-assignment.entity";
import { UserRoleAssignment } from "../entities/user-role-assignment.entity";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _authorizationService: AuthorizationService,
    @InjectRepository(UserRoleAssignment)
    private readonly _userRoleAssignmentRepository: Repository<UserRoleAssignment>,
    @InjectRepository(UserPermissionAssignment)
    private readonly _userPermissionAssignmentRepository: Repository<UserPermissionAssignment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this._reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as ActiveUserContract | undefined;

    if (!user?.sub || user.tenantId == null) {
      throw new UnauthorizedException();
    }

    if (await this._isColdStartBootstrap()) {
      return true;
    }

    const results = await Promise.all(
      requiredPermissions.map((permission) =>
        this._authorizationService.hasPermission(
          user.sub,
          user.tenantId,
          permission,
        ),
      ),
    );

    const allowed = results.some(Boolean);

    if (!allowed) {
      throw new ForbiddenException(
        `Missing required permission(s): ${requiredPermissions.join(", ")}`,
      );
    }

    return true;
  }

  /**
   * Allows the first authenticated requests to manage authorization
   * before any role/permission assignments exist in the database.
   */
  private async _isColdStartBootstrap(): Promise<boolean> {
    const [roleCount, permissionCount] = await Promise.all([
      this._userRoleAssignmentRepository.count(),
      this._userPermissionAssignmentRepository.count(),
    ]);
    return roleCount === 0 && permissionCount === 0;
  }
}
