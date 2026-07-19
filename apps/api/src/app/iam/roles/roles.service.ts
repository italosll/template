import { EntityService } from "@api/common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { ResponseRoleDTO } from "./dto/response-role.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";
import { RoleFactory } from "./factories/role.factory";
import { ColumnQueryParameters } from "@api/common/utils/crud-helper.util";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";
import { PermissionsService } from "@api/iam/permissions/permissions.service";
import { AuthorizationService } from "@api/iam/authorization/authorization.service";

@Injectable()
export class RolesService
  implements EntityService<ResponseRoleDTO, CreateRoleDTO, UpdateRoleDTO>
{
  constructor(
    @InjectRepository(Role)
    private readonly _rolesRepository: Repository<Role>,
    private readonly _permissionsService: PermissionsService,
    private readonly _authorizationService: AuthorizationService
  ) {}

  private async _resolvePermissions(permissionIds: number[]) {
    const permissions =
      await this._permissionsService.findByIds(permissionIds);

    if (permissions.length !== permissionIds.length) {
      const foundIds = new Set(permissions.map((p) => p.id));
      const missing = permissionIds.find((id) => !foundIds.has(id));
      throw new HttpException(
        `Permissao invalida: id=${missing}`,
        HttpStatus.BAD_REQUEST
      );
    }

    return permissions;
  }

  async findAll(params: {
    textToSearch?: string;
    id?: number;
  }): Promise<ResponseRoleDTO[]> {
    const queryBuilder = this._rolesRepository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission");

    const queriesParameters: ColumnQueryParameters<Role>[] =
      getQueriesParameters();

    queryBuilder.andWhereMultipleColumns(params, queriesParameters);

    const roles = await queryBuilder.getMany();
    const factory = new RoleFactory();
    return roles.map((role) => factory.fromEntity(role));
  }

  async create(
    createEntity: CreateRoleDTO
  ): Promise<CreateDefaultResponseDTO> {
    const registeredRole = await this._rolesRepository.findOneBy({
      name: createEntity.name,
    });

    if (registeredRole) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.alreadyExists(),
        HttpStatus.CONFLICT
      );
    }

    const permissions = await this._resolvePermissions(
      createEntity.permissionIds
    );

    const entity = this._rolesRepository.create({
      name: createEntity.name,
      permissions,
    });
    const created = await this._rolesRepository.save(entity);
    return { id: created.id };
  }

  async update(
    updateEntity?: UpdateRoleDTO
  ): Promise<UpdateDefaultResponseDTO> {
    const registeredRole = await this._rolesRepository.findOne({
      where: { id: updateEntity?.id },
      relations: ["permissions"],
    });

    if (!registeredRole) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    if (updateEntity?.name) {
      registeredRole.name = updateEntity.name;
    }

    if (updateEntity?.permissionIds) {
      registeredRole.permissions = await this._resolvePermissions(
        updateEntity.permissionIds
      );
    }

    await this._rolesRepository.save(registeredRole);
    await this._authorizationService.invalidateRoleCache(registeredRole.id);

    return { id: registeredRole.id };
  }

  async delete(ids: number[]) {
    const roles = await this._rolesRepository.findBy({ id: In(ids) });

    if (roles.length !== ids.length) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    await this._rolesRepository.softDelete({ id: In(ids) });
    await Promise.all(
      ids.map((id) => this._authorizationService.invalidateRoleCache(id))
    );
    return { ids };
  }

  async hardDelete(ids: number[]) {
    const roles = await this._rolesRepository.findBy({ id: In(ids) });

    if (roles.length !== ids.length) {
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );
    }

    await this._rolesRepository.delete({ id: In(ids) });
    await Promise.all(
      ids.map((id) => this._authorizationService.invalidateRoleCache(id))
    );
    return { ids };
  }
}
