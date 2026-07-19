import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UserRoleAssignment } from "./entities/user-role-assignment.entity";
import { UserPermissionAssignment } from "./entities/user-permission-assignment.entity";
import { Role } from "@api/iam/roles/entities/role.entity";
import { Permission } from "@api/iam/permissions/entities/permission.entity";
import { User } from "@api/users/entities/user.entity";
import { AuthorizationService } from "./authorization.service";
import { AssignRoleDto } from "./dto/assign-role.dto";
import { AssignPermissionDto } from "./dto/assign-permission.dto";

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(UserRoleAssignment)
    private readonly _userRoleAssignmentRepository: Repository<UserRoleAssignment>,
    @InjectRepository(UserPermissionAssignment)
    private readonly _userPermissionAssignmentRepository: Repository<UserPermissionAssignment>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly _permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _authorizationService: AuthorizationService
  ) {}

  async assignRole(dto: AssignRoleDto): Promise<{ id: number }> {
    await this._ensureUserExists(dto.userId);
    await this._ensureRoleExists(dto.roleId);

    const tenantId = dto.tenantId ?? null;
    const existing = await this._findRoleAssignment(
      dto.userId,
      dto.roleId,
      tenantId
    );

    if (existing) {
      throw new ConflictException("Role already assigned in this scope");
    }

    const assignment = this._userRoleAssignmentRepository.create({
      userId: dto.userId,
      roleId: dto.roleId,
      tenantId,
    });
    const saved = await this._userRoleAssignmentRepository.save(assignment);
    await this._invalidateAfterAssignmentChange(dto.userId, tenantId);

    return { id: saved.id };
  }

  async revokeRole(
    userId: number,
    roleId: number,
    tenantId?: number | null
  ): Promise<void> {
    const scopeTenantId = tenantId === undefined ? null : tenantId;
    const existing = await this._findRoleAssignment(
      userId,
      roleId,
      scopeTenantId
    );

    if (!existing) {
      throw new NotFoundException("Role assignment not found");
    }

    await this._userRoleAssignmentRepository.delete(existing.id);
    await this._invalidateAfterAssignmentChange(userId, scopeTenantId);
  }

  async assignPermission(dto: AssignPermissionDto): Promise<{ id: number }> {
    await this._ensureUserExists(dto.userId);
    await this._ensurePermissionExists(dto.permissionId);

    const tenantId = dto.tenantId ?? null;
    const existing = await this._findPermissionAssignment(
      dto.userId,
      dto.permissionId,
      tenantId
    );

    if (existing) {
      throw new ConflictException("Permission already assigned in this scope");
    }

    const assignment = this._userPermissionAssignmentRepository.create({
      userId: dto.userId,
      permissionId: dto.permissionId,
      tenantId,
    });
    const saved =
      await this._userPermissionAssignmentRepository.save(assignment);
    await this._invalidateAfterAssignmentChange(dto.userId, tenantId);

    return { id: saved.id };
  }

  async revokePermission(
    userId: number,
    permissionId: number,
    tenantId?: number | null
  ): Promise<void> {
    const scopeTenantId = tenantId === undefined ? null : tenantId;
    const existing = await this._findPermissionAssignment(
      userId,
      permissionId,
      scopeTenantId
    );

    if (!existing) {
      throw new NotFoundException("Permission assignment not found");
    }

    await this._userPermissionAssignmentRepository.delete(existing.id);
    await this._invalidateAfterAssignmentChange(userId, scopeTenantId);
  }

  async listUserRoleAssignments(
    userId: number
  ): Promise<UserRoleAssignment[]> {
    return this._userRoleAssignmentRepository.find({
      where: { userId },
      relations: ["role"],
    });
  }

  async listUserPermissionAssignments(
    userId: number
  ): Promise<UserPermissionAssignment[]> {
    return this._userPermissionAssignmentRepository.find({
      where: { userId },
      relations: ["permission"],
    });
  }

  private async _invalidateAfterAssignmentChange(
    userId: number,
    tenantId: number | null
  ): Promise<void> {
    if (tenantId === null) {
      await this._authorizationService.invalidateUserCache(userId);
      return;
    }
    await this._authorizationService.invalidateUserTenantCache(
      userId,
      tenantId
    );
  }

  private async _findRoleAssignment(
    userId: number,
    roleId: number,
    tenantId: number | null
  ): Promise<UserRoleAssignment | null> {
    return this._userRoleAssignmentRepository.findOne({
      where:
        tenantId === null
          ? { userId, roleId, tenantId: IsNull() }
          : { userId, roleId, tenantId },
    });
  }

  private async _findPermissionAssignment(
    userId: number,
    permissionId: number,
    tenantId: number | null
  ): Promise<UserPermissionAssignment | null> {
    return this._userPermissionAssignmentRepository.findOne({
      where:
        tenantId === null
          ? { userId, permissionId, tenantId: IsNull() }
          : { userId, permissionId, tenantId },
    });
  }

  private async _ensureUserExists(userId: number): Promise<void> {
    const user = await this._userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }
  }

  private async _ensureRoleExists(roleId: number): Promise<void> {
    const role = await this._roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new NotFoundException(`Role #${roleId} not found`);
    }
  }

  private async _ensurePermissionExists(permissionId: number): Promise<void> {
    const permission = await this._permissionRepository.findOneBy({
      id: permissionId,
    });
    if (!permission) {
      throw new NotFoundException(`Permission #${permissionId} not found`);
    }
  }
}
