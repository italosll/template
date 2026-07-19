import { AuditContract } from "@api/common/contracts/audit.contract";
import { FactoryContract } from "@api/common/contracts/factory.contract";
import { plainToInstance } from "class-transformer";
import { CreateRoleDTO } from "../dto/create-role.dto";
import { ResponseRoleDTO } from "../dto/response-role.dto";
import { UpdateRoleDTO } from "../dto/update-role.dto";
import { Role } from "../entities/role.entity";

export class RoleFactory
  implements FactoryContract<CreateRoleDTO, UpdateRoleDTO, ResponseRoleDTO>
{
  private _fakeData: Partial<CreateRoleDTO | UpdateRoleDTO | ResponseRoleDTO> = {
    id: 1,
    name: "Admin",
    permissionIds: [1, 2],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    recoveredAt: new Date(),
  };

  public create(
    params?: Partial<CreateRoleDTO & AuditContract> | null,
    setFakeData = false
  ) {
    return plainToInstance(
      CreateRoleDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public update(
    params?: Partial<UpdateRoleDTO & AuditContract> | null,
    setFakeData = false
  ) {
    return plainToInstance(
      UpdateRoleDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public response(
    params?: Partial<ResponseRoleDTO & AuditContract> | null,
    setFakeData = false
  ) {
    return plainToInstance(
      ResponseRoleDTO,
      setFakeData ? { ...this._fakeData, ...params } : params
    );
  }

  public fromEntity(role: Role): ResponseRoleDTO {
    return this.response({
      id: role.id,
      name: role.name,
      permissionIds: role.permissions?.map((p) => p.id) ?? [],
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      deletedAt: role.deletedAt,
      recoveredAt: role.recoveredAt,
    });
  }
}
