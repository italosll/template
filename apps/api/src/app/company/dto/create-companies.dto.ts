import { ImageContract } from '@interfaces/image.contract';
import { CompanyContract } from '@interfaces/company.contract';
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCompanyDTO implements Omit<CompanyContract, "id">{
  
  @IsNotEmpty()
  @IsString()
  @Length(14,14)
  public cnpj : string;

  @IsNotEmpty()
  @IsString()
  public fantasyName: string;

  @IsNotEmpty()
  @IsString()
  public companyName: string;

  public image:ImageContract;
}
