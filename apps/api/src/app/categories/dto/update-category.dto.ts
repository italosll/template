import { CreateCategoryDTO } from "./create-category.dto";

export class UpdateCategoryDTO extends CreateCategoryDTO{
  id:number;

  constructor(updateCategoryDTO:UpdateCategoryDTO){
    super(updateCategoryDTO);
    this.id = updateCategoryDTO.id;
  }
}
