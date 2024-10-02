import { UserContract } from "@template/interfaces";
import { AuditContract } from "../../common/contracts/audit.contract";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { FullUserDTO } from "../dto/full-user.dto";

export class UserFactory{
  public id: number;
  public email: string;
  public filterableEmail: string;
  public password: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;

  constructor(user?: Partial<UserContract & AuditContract>){
    this.id = user?.id ?? 1;
    this.email = this?.email ?? "email@email.com";
    this.filterableEmail = this?.filterableEmail ?? "emai";
    this.password = this?.password ?? "password";
    this.createdAt = this?.createdAt ?? new Date();
    this.updatedAt = this?.updatedAt ?? new Date();
    this.deletedAt = this?.deletedAt ?? new Date();
    this.recoveredAt = this?.recoveredAt ?? new Date();
  }

  createUser = () =>  new CreateUserDTO(this);

  updateUser = () =>  new UpdateUserDTO(this);

  fullUser = () => new FullUserDTO(this);
}

