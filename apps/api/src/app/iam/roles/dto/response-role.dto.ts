import { RoleContract } from "@interfaces/role.contract";
import { AuditContract } from "@api/common/contracts/audit.contract";

export class ResponseRoleDTO implements RoleContract, AuditContract {
  public id!: number;
  public name!: string;
  public permissions!: RoleContract["permissions"];
  public tenantId!: number;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
  public recoveredAt!: Date;
}
