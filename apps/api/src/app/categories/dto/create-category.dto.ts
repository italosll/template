import { CategoryContract } from "@interfaces/category.contract";
import { CreateTenantContract } from "@interfaces/tenant.contract";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCategoryDTO implements Omit<CategoryContract, "id">, CreateTenantContract {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public code!: string;

  @IsNumber()
  public tenantId!: number;

  // constructor (createCategoryDTO:CreateCategoryDTO ){
  //   this.name = createCategoryDTO.name;
  //   this.code = createCategoryDTO.name;
  // }
}
