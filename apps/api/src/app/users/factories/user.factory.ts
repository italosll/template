import { UserContract } from "@interfaces/user.contract";
import { AuditContract } from "../../common/contracts/audit.contract";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UpdateUserDTO } from "../dto/update-user.dto";
import { FullUserDTO } from "../dto/full-user.dto";
import { bindAuditProperties } from "../../products/utils/bind-audit-properties.util";
import { FactoryContract } from "../../common/contracts/factory.contract";

export class UserFactory implements UserContract, AuditContract
// FactoryContract
{
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
    this.email = user?.email ?? "email@email.com";
    this.filterableEmail = user?.filterableEmail ?? "emai";
    this.password = user?.password ?? "password";
    bindAuditProperties(this, user);

  }

  createData = (params?) =>  new CreateUserDTO({...this, ...params});

  updateData = (params?) =>  new UpdateUserDTO({...this, ...params});

  fullData = (params?) => new FullUserDTO({...this, ...params});
}

