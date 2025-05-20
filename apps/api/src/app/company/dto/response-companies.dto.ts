import { CompanyContract } from "@interfaces/company.contract";
import { FileContract } from "@interfaces/file.contract";
import { AuditContract } from "../../common/contracts/audit.contract";

export class ResponseCompanyDTO implements CompanyContract, AuditContract {
  public id: number;
  public fantasyName: string;
  public companyName: string;
  public cnpj: string;
  public image: FileContract;

  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;
}
