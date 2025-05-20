import { CompanyContract } from "@interfaces/company.contract";
import { FileContract } from "@interfaces/file.contract";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { TenantDTO } from "../../common/dto/tenant.dto";

export class CreateCompanyDTO
  extends TenantDTO
  implements Omit<CompanyContract, "id">
{
  @IsNotEmpty()
  @IsString()
  @Length(14, 14)
  public cnpj: string;

  @IsNotEmpty()
  @IsString()
  public fantasyName: string;

  @IsNotEmpty()
  @IsString()
  public companyName: string;

  public image: FileContract;
}
