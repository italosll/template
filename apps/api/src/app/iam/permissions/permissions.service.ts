import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Permission } from "./entities/permission.entity";
import { ALL_PERMISSION_CODES } from "@interfaces/permission-code.contract";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { ConflictException, NotFoundException } from "@nestjs/common";

@Injectable()
export class PermissionsService implements OnModuleInit {
  private readonly _logger = new Logger(PermissionsService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly _permissionRepository: Repository<Permission>
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedCatalog();
  }

  async seedCatalog(): Promise<void> {
    const existing = await this._permissionRepository.find({
      select: ["code"],
    });
    const existingCodes = new Set(existing.map((p) => p.code));
    const missing = ALL_PERMISSION_CODES.filter(
      (code) => !existingCodes.has(code)
    );

    if (missing.length === 0) {
      return;
    }

    const entities = missing.map((code) =>
      this._permissionRepository.create({ code })
    );
    await this._permissionRepository.save(entities);
    this._logger.log(`Seeded ${missing.length} permission(s)`);
  }

  async findAll(): Promise<Permission[]> {
    return this._permissionRepository.find({ order: { code: "ASC" } });
  }

  async findByIds(ids: number[]): Promise<Permission[]> {
    if (ids.length === 0) {
      return [];
    }
    return this._permissionRepository.findBy({ id: In(ids) });
  }

  async findByCodes(codes: string[]): Promise<Permission[]> {
    if (codes.length === 0) {
      return [];
    }
    return this._permissionRepository.findBy({ code: In(codes) });
  }

  async create(dto: CreatePermissionDto): Promise<{ id: number }> {
    const existing = await this._permissionRepository.findOneBy({
      code: dto.code,
    });
    if (existing) {
      throw new ConflictException(HTTP_ERROR_MESSAGES.alreadyExists());
    }

    const created = await this._permissionRepository.save(
      this._permissionRepository.create(dto)
    );
    return { id: created.id };
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this._permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(HTTP_ERROR_MESSAGES.notFound());
    }
    return permission;
  }
}
