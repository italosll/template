import { CategoryContract } from "@interfaces/category.contract";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDTO implements Omit<CategoryContract, "id"> {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public code!: string;

  // constructor (createCategoryDTO:CreateCategoryDTO ){
  //   this.name = createCategoryDTO.name;
  //   this.code = createCategoryDTO.name;
  // }
}
