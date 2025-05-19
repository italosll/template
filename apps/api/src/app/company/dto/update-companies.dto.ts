import { IsNotEmpty, IsNumber} from "class-validator";
import { CompanyContract } from "@interfaces/company.contract";
import { CreateCompanyDTO } from "./create-companies.dto";

export class UpdateCompanyDTO extends CreateCompanyDTO implements CompanyContract{
  @IsNotEmpty()
  @IsNumber()
  public id: number;
}
