import { TenantDTO } from "@api/common/dto/tenant.dto";
import { CreateTenantContract } from "@interfaces/tenant.contract";
import { UserContract } from "@interfaces/user.contract";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDTO
  implements
    Omit<UserContract, "id" | "filterableEmail" | "filterablePhoneNumber">, CreateTenantContract 
{
  @IsOptional()
  @IsString()
  public phoneNumber?: string | null = null;

  @IsString()
  public email!: string;

  @IsString()
  public password!: string;

  @IsNumber()
  public tenantId!: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  public roleIds?: number[];
}
