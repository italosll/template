import { CategoryContract } from "@template/interfaces";
import { UpdateCategoryDTO } from "./update-category.dto";
import { AuditContract } from "../../common/contracts/audit.contract";

export class FullCategoryDTO extends UpdateCategoryDTO implements CategoryContract, AuditContract{
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;

  constructor (fullCategoryDTO:FullCategoryDTO ){
    super(fullCategoryDTO);
    this.createdAt = fullCategoryDTO.createdAt;
    this.updatedAt = fullCategoryDTO.updatedAt;
    this.deletedAt = fullCategoryDTO.deletedAt;
    this.recoveredAt = fullCategoryDTO.recoveredAt;
  }
}
