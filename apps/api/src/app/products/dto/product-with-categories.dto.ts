import { CategoryContract } from "@template/interfaces";
import { Category } from "../../categories/entities/category.entity";
import { CreateProductDTO } from "./create-product.dto";
import { UpdateProductDTO } from "./update-product.dto";
import { FullProductDTO } from "./full-product.dto";

export class ProductWithCategoriesDTO extends FullProductDTO implements Omit<CategoryContract, "id">{
  public categories: Category[];

  constructor (createProductDTO:ProductWithCategoriesDTO ){
    super(createProductDTO)
    this.categories = createProductDTO.categories;
  }
}
