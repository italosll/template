import { ProductContract } from "@interfaces/product.contract"
import { CreateProductDTO } from "./create-product.dto";
import { AuditContract } from "../../common/contracts/audit.contract";

export class FullProductDTO extends CreateProductDTO implements ProductContract, AuditContract{
  public id: number
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public recoveredAt: Date;

  constructor(fullProductDTO:FullProductDTO){
    super(fullProductDTO);
    this.id = fullProductDTO.id;
    this.createdAt = fullProductDTO.createdAt;
    this.updatedAt = fullProductDTO.updatedAt;
    this.deletedAt = fullProductDTO.deletedAt;
    this.recoveredAt = fullProductDTO.recoveredAt;

  }
}
