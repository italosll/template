import { IsNotEmpty, IsNumber} from "class-validator";
import { ProductContract } from "@interfaces/product.contract";
import { CreateProductDTO } from "./create-product.dto";

export class UpdateProductDTO extends CreateProductDTO implements ProductContract{
  @IsNotEmpty()
  @IsNumber()
  public id: number;
}
