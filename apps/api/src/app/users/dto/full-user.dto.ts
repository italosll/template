import { UserContract } from "@template/interfaces";
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

  constructor(updateUserDTO:FullUserDTO){
    this.id = updateUserDTO.id;
    this.email = updateUserDTO.email;
    this.password = updateUserDTO.password;
    this.filterableEmail = updateUserDTO.filterableEmail;
    this.createdAt = updateUserDTO?.createdAt;
    this.updatedAt = updateUserDTO?.updatedAt;
    this.deletedAt = updateUserDTO?.deletedAt;
    this.recoveredAt = updateUserDTO?.recoveredAt;
  }
}
