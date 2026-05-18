import { UserContract } from "@interfaces/user.contract";
import { AuditContract } from "../../common/contracts/audit.contract";

export class responseUserDTO implements UserContract, AuditContract {
  public phoneNumber!: string;
  public filterablePhoneNumber!: string;
  public tenantId?: number|undefined|null;
  public id!: number;
  public email!: string;
  public password!: string;
  public filterableEmail!: string;
  public roleIds?: number[];
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
  public recoveredAt!: Date;
}
