import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UserRoleAssignment } from "./entities/user-role-assignment.entity";
import { UserPermissionAssignment } from "./entities/user-permission-assignment.entity";
import { Role } from "@api/iam/roles/entities/role.entity";

@Injectable()
export class AuthorizationRepository {
  constructor(
    @InjectRepository(UserRoleAssignment)
    private readonly _userRoleAssignmentRepository: Repository<UserRoleAssignment>,
    @InjectRepository(UserPermissionAssignment)
    private readonly _userPermissionAssignmentRepository: Repository<UserPermissionAssignment>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>
  ) {}

  /**
   * Resolves effective permission codes for a user in a tenant context.
   * Union of:
   * - role permissions for this tenant
   * - direct permissions for this tenant
   * - GLOBAL role permissions
   * - GLOBAL direct permissions
   */
  async resolveEffectivePermissionCodes(
    userId: number,
    tenantId: number
  ): Promise<string[]> {
    const [tenantRoleCodes, globalRoleCodes, tenantDirectCodes, globalDirectCodes] =
      await Promise.all([
        this._findRolePermissionCodes(userId, tenantId),
        this._findRolePermissionCodes(userId, null),
        this._findDirectPermissionCodes(userId, tenantId),
        this._findDirectPermissionCodes(userId, null),
      ]);

    return [
      ...new Set([
        ...tenantRoleCodes,
        ...globalRoleCodes,
        ...tenantDirectCodes,
        ...globalDirectCodes,
      ]),
    ];
  }

  async findUserIdsByRoleId(roleId: number): Promise<number[]> {
    const assignments = await this._userRoleAssignmentRepository.find({
      where: { roleId },
      select: ["userId"],
    });
    return [...new Set(assignments.map((a) => a.userId))];
  }

  private async _findRolePermissionCodes(
    userId: number,
    tenantId: number | null
  ): Promise<string[]> {
    const where =
      tenantId === null
        ? { userId, tenantId: IsNull() }
        : { userId, tenantId };

    const assignments = await this._userRoleAssignmentRepository.find({
      where,
      select: ["roleId"],
    });

    if (assignments.length === 0) {
      return [];
    }

    const roleIds = assignments.map((a) => a.roleId);
    const roles = await this._roleRepository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission")
      .where("role.id IN (:...roleIds)", { roleIds })
      .getMany();

    return roles.flatMap(
      (role) => role.permissions?.map((p) => p.code) ?? []
    );
  }

  private async _findDirectPermissionCodes(
    userId: number,
    tenantId: number | null
  ): Promise<string[]> {
    const qb = this._userPermissionAssignmentRepository
      .createQueryBuilder("assignment")
      .innerJoinAndSelect("assignment.permission", "permission")
      .where("assignment.userId = :userId", { userId });

    if (tenantId === null) {
      qb.andWhere("assignment.tenantId IS NULL");
    } else {
      qb.andWhere("assignment.tenantId = :tenantId", { tenantId });
    }

    const assignments = await qb.getMany();
    return assignments.map((a) => a.permission.code);
  }
}
