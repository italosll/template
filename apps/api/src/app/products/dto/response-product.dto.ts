import { ProductContract } from "@interfaces/product.contract"
import { AuditContract } from "../../common/contracts/audit.contract";

export class ResponseProductDTO implements ProductContract, AuditContract{
  public id: number
  public name: string
  public code: string
  public description: string
  public amount: number
  public cost: number
  public sellingPrice: number
  public maxDiscountPercentage: number
  
  public image: {
    name?: string;
    url?: string;
    base64file?: string;
  }

  public categoryIds:number[]

  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;
}
