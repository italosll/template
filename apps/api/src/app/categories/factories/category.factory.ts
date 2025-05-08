import { CategoryContract } from "@interfaces/category.contract";
 
import { AuditContract } from "../../common/contracts/audit.contract";
import { CreateCategoryDTO } from "../dto/create-category.dto";
import { UpdateCategoryDTO } from "../dto/update-category.dto";
import { FullCategoryDTO } from "../dto/full-category.dto";
import { FactoryContract } from "../../common/contracts/factory.contract";
import { bindAuditProperties } from "../../products/utils/bind-audit-properties.util";

export class CategoryFactory implements 
// FactoryContract,
 CategoryContract, AuditContract{
  public id: number;
  public name: string;
  public code: string;
 
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;
 

  constructor(category?: Partial<CategoryContract & AuditContract>) {
    this.id = category?.id ?? 1;
    this.name = category?.name ?? "Default Category Name";
    this.code = category?.code ?? "C123";
    bindAuditProperties(this, category);
  }


  createData = (params?) => new CreateCategoryDTO({...this, ...params});

  updateData = (params?) => new UpdateCategoryDTO({...this, ...params});

  fullData = (params?) => new FullCategoryDTO({...this, ...params});
}
