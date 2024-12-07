import { CategoryContract } from "@template/interfaces";
import { UpdateCategoryDTO } from "./update-category.dto";
import { AuditContract } from "../../common/contracts/audit.contract";

export class FullCategoryDTO extends UpdateCategoryDTO implements CategoryContract, AuditContract{
  public id: number;
  public name: string;
  public code: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;

  constructor (fullCategoryDTO:FullCategoryDTO ){
    super(fullCategoryDTO)
    Object.assign(this, fullCategoryDTO);

  }
}
