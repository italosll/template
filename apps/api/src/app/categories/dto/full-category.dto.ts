import { CategoryContract } from "@interfaces/category.contract";
import { AuditContract } from "../../common/contracts/audit.contract";

export class FullCategoryDTO implements CategoryContract, AuditContract {
  public id!: number;
  public name!: string;
  public code!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
  public recoveredAt!: Date;
}
