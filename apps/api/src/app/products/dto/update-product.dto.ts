import { CategoryContract } from "@template/interfaces";
import { CreateProductDTO } from "./create-product.dto";

export class UpdateProductDTO extends CreateProductDTO implements CategoryContract{
  id:number;

  constructor(updateProductDTO:UpdateProductDTO){
    super(updateProductDTO)
    this.id = updateProductDTO.id;
  }
}
