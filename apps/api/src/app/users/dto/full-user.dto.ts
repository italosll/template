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

  constructor(fullUserDTO:FullUserDTO){
    this.id = fullUserDTO.id;
    this.email = fullUserDTO.email;
    this.password = fullUserDTO.password;
    this.filterableEmail = fullUserDTO.filterableEmail;
    this.createdAt = fullUserDTO?.createdAt;
    this.updatedAt = fullUserDTO?.updatedAt;
    this.deletedAt = fullUserDTO?.deletedAt;
    this.recoveredAt = fullUserDTO?.recoveredAt;
  }
}
