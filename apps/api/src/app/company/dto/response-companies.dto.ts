import { ImageContract } from "@interfaces/image.contract";
import { AuditContract } from "../../common/contracts/audit.contract";
import { CompanyContract } from "@interfaces/company.contract";

export class ResponseCompanyDTO implements CompanyContract, AuditContract{
  public id: number
  public fantasyName: string
  public companyName: string
  public cnpj: string
  public image:ImageContract

  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;
}
