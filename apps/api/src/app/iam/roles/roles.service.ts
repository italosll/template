import { AuditContract } from "@api/common/contracts/audit.contract";
import { EntityService } from "@api/common/services/entity.service";
import { HTTP_ERROR_MESSAGES } from "@api/common/utils/http-error-messages.util";
import { PermissionContract } from "@interfaces/permission.contract";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateRoleDTO } from "./dto/create-role.dto";
import { ResponseRoleDTO } from "./dto/response-role.dto";
import { UpdateRoleDTO } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";
import { RoleFactory } from "./factories/role.factory";
import { getAllowedPermissionKeys, toPermissionKey } from "./utils/permissions.util";
import { ColumnQueryParameters } from "@api/common/utils/crud-helper.util";
import { getQueriesParameters } from "./utils/get-queries-parameters.util";
import { CreateDefaultResponseDTO } from "@interfaces/create-default-response.dto";
import { UpdateDefaultResponseDTO } from "@interfaces/update-default-response.dto";

@Injectable()
export class RolesService
  implements EntityService<ResponseRoleDTO, CreateRoleDTO, UpdateRoleDTO>
{
  constructor(
    @InjectRepository(Role)
    private readonly _rolesRepository: Repository<Role>
  ) {}

  private _validatePermissions(permissions?: PermissionContract[]): void {
    if (!permissions) return;

    const allowedKeys = getAllowedPermissionKeys();
    const invalid = permissions.filter(
      (permission) => !allowedKeys.has(toPermissionKey(permission))
    );

    if (invalid.length > 0) {
      throw new HttpException(
        `Permissao invalida: ${toPermissionKey(invalid[0])}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(
    params:{textToSearch?:string, id?:number} 
  ): Promise<ResponseRoleDTO[]> {
    const queryBuilder = this._rolesRepository.createQueryBuilder();

    const queriesParameters: ColumnQueryParameters<Role>[] =
      getQueriesParameters();

    queryBuilder.andWhereMultipleColumns(params, queriesParameters);


    const roles = await queryBuilder.getMany();
    const factory = new RoleFactory();
    return roles.map((role) => factory.response(role));
  }

  async create(
    createEntity: CreateRoleDTO
  ): Promise<CreateDefaultResponseDTO> {
    this._validatePermissions(createEntity.permissions);

    const registeredRole = await this._rolesRepository.findOneBy({
      name: createEntity.name,
      tenantId: createEntity.tenantId,
    });

    if (registeredRole)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.alreadyExists(),
        HttpStatus.CONFLICT
      );

    const entity = this._rolesRepository.create(createEntity);
    const created = await this._rolesRepository.save(entity);
    return { id: created.id };
  }

  async update(
    updateEntity?: UpdateRoleDTO
  ): Promise<UpdateDefaultResponseDTO> {
    const registeredRole = await this._rolesRepository.findOneBy({
      id: updateEntity?.id,
    });

    if (!registeredRole)
      throw new HttpException(
        HTTP_ERROR_MESSAGES.notFound(),
        HttpStatus.NOT_FOUND
      );

    if (updateEntity?.permissions) {
      this._validatePermissions(updateEntity.permissions);
    }

    const merged = this._rolesRepository.merge(
      registeredRole,
      updateEntity ?? {}
    );
    await this._rolesRepository.save(merged);
    return { id: registeredRole.id };
  }

  async delete(ids: number[]) {
    const roles = await this._rolesRepository.find();

    ids.forEach((id) => {
      const registeredRole = roles?.find((role) => role.id === id);
      if (!registeredRole)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    });

    await this._rolesRepository.softDelete({ id: In(ids) });
    return { ids };
  }

  async hardDelete(ids: number[]) {
    const roles = await this._rolesRepository.find();

    ids.forEach((id) => {
      const registeredRole = roles?.find((role) => role.id === id);
      if (!registeredRole)
        throw new HttpException(
          HTTP_ERROR_MESSAGES.notFound(),
          HttpStatus.NOT_FOUND
        );
    });

    await this._rolesRepository.delete({ id: In(ids) });
    return { ids };
  }
}
