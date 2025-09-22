import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateCategoryDTO } from "./create-category.dto";

export class UpdateCategoryDTO extends CreateCategoryDTO {
  @IsNotEmpty()
  @IsNumber()
  public id!: number;

  // constructor(updateCategoryDTO:UpdateCategoryDTO){
  //   super(updateCategoryDTO);
  //   this.id = updateCategoryDTO.id;
  // }
}
