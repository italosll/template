import { CategoryContract } from "@template/interfaces";

export class CreateCategoryDTO implements Omit<CategoryContract, "id">{
  public name: string;
  public code: string;

  constructor (createCategoryDTO:CreateCategoryDTO ){
    Object.assign(this, createCategoryDTO);
  }
}
