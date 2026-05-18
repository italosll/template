import { TenantDTO } from "@api/common/dto/tenant.dto";
import { UserContract } from "@interfaces/user.contract";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDTO
  extends TenantDTO
  implements Omit<UserContract, "filterableEmail" | "filterablePhoneNumber">
{
  @IsString()
  public id!: number;

  @IsString()
  public phoneNumber?: string;

  @IsString()
  public email?: string;

  @IsString()
  public password!: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  public roleIds?: number[];
}
