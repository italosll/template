import { CategoryContract } from '@interfaces/category.contract';

export class CreateCategoryDTO implements Omit<CategoryContract, "id">{
  public name: string;
  public code: string;

  constructor (createCategoryDTO:CreateCategoryDTO ){
    this.name = createCategoryDTO.name;
    this.code = createCategoryDTO.name;
  }
}
