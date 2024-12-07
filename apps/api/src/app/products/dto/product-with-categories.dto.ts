import { CategoryContract } from "@template/interfaces";
import { Category } from "../../categories/entities/category.entity";
import { UpdateCategoryDTO } from "../../categories/dto/update-category.dto";
import { CreateCategoryDTO } from "../../categories/dto/create-category.dto";
import { CreateProductDTO } from "./create-product.dto";

export class ProductWithCategoriesDTO extends CreateProductDTO implements Omit<CategoryContract, "id">{
  public categories: Category[];

  constructor (createProductDTO:ProductWithCategoriesDTO ){
    super(createProductDTO)
    Object.assign(this, createProductDTO);
  }
}
