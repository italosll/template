import { UserContract } from "@interfaces/user.contract";
import { AuditContract } from "../../common/contracts/audit.contract";

export class FullUserDTO implements UserContract, AuditContract{
  public id:number;
  public email:string;
  public password:string;
  public filterableEmail: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;

 
}
