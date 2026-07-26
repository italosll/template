import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "@api/iam/roles/entities/role.entity";
import { PermissionsService } from "@api/iam/permissions/permissions.service";
import {
  ALL_PERMISSION_CODES,
  PERMISSION_CODES,
} from "@interfaces/permission-code.contract";

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SuperAdmin",
  ADMINISTRATOR: "Administrator",
} as const;

@Injectable()
export class RoleBootstrapService implements OnModuleInit {
  private readonly _logger = new Logger(RoleBootstrapService.name);

  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    private readonly _permissionsService: PermissionsService
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureSystemRoles();
  }

  async ensureSystemRoles(): Promise<void> {
    await this._permissionsService.seedCatalog();

    const allPermissions = await this._permissionsService.findByCodes([
      ...ALL_PERMISSION_CODES,
    ]);

    await this._upsertRole(SYSTEM_ROLES.SUPER_ADMIN, allPermissions);

    const adminCodes = [
      PERMISSION_CODES.PRODUCT_CREATE,
      PERMISSION_CODES.PRODUCT_READ,
      PERMISSION_CODES.PRODUCT_UPDATE,
      PERMISSION_CODES.PRODUCT_DELETE,
      PERMISSION_CODES.USER_CREATE,
      PERMISSION_CODES.USER_READ,
      PERMISSION_CODES.USER_UPDATE,
      PERMISSION_CODES.USER_DELETE,
      PERMISSION_CODES.ROLE_CREATE,
      PERMISSION_CODES.ROLE_READ,
      PERMISSION_CODES.ROLE_UPDATE,
      PERMISSION_CODES.ROLE_DELETE,
      PERMISSION_CODES.AUDIT_READ,
    ];
    const adminPermissions =
      await this._permissionsService.findByCodes(adminCodes);
    await this._upsertRole(SYSTEM_ROLES.ADMINISTRATOR, adminPermissions);

    this._logger.log("System roles ensured");
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return this._roleRepository.findOne({
      where: { name },
      relations: ["permissions"],
    });
  }

  private async _upsertRole(
    name: string,
    permissions: Awaited<ReturnType<PermissionsService["findByCodes"]>>
  ): Promise<Role> {
    let role = await this._roleRepository.findOne({
      where: { name },
      relations: ["permissions"],
    });

    if (!role) {
      role = this._roleRepository.create({ name, permissions });
    } else {
      role.permissions = permissions;
    }

    return this._roleRepository.save(role);
  }
}
