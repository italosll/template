import { UserContract } from "@template/interfaces";
import { AuditContract } from "../../common/contracts/Audit.contract";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";

export class UserFactory{
  public id: number;
  public email: string;
  public filterableEmail: string;
  public password: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletetedAt: Date;
  public recoveredAt: Date;

  constructor(user?: Partial<UserContract & AuditContract>){
    this.id = user?.id ?? 1;
    this.email = this?.email ?? "email@email.com";
    this.filterableEmail = this?.filterableEmail ?? "emai";
    this.password = this?.password ?? "password";
    this.createdAt = this?.createdAt ?? new Date();
    this.updatedAt = this?.updatedAt ?? new Date();
    this.deletetedAt = this?.deletetedAt ?? new Date();
    this.recoveredAt = this?.recoveredAt ?? new Date();
  }

  createUser = () =>  new CreateUserDTO(this);

  createdUser = () => {
    return { ...( new CreateUserDTO(this)), createdAt: this.createdAt}
  }

  updateUser = () =>  new UpdateUserDTO(this);

  updatedUser = () => {
    return { ...( new UpdateUserDTO(this)), updatedAt: this.updatedAt}

  }

  fullUser = (): UserContract & AuditContract =>{
    return {
      id : this.id,
      email : this.email,
      filterableEmail : this.filterableEmail,
      password : this.password,
      createdAt : this.createdAt,
      updatedAt : this.updatedAt,
      deletedAt : this.deletetedAt,
      recoveredAt : this.recoveredAt,
    }
  }
}

