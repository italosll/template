import { UserContract } from "@interfaces/user.contract";
import { IsString } from "class-validator";
import { TenantDTO } from "../../common/dto/tenant.dto";

export class CreateUserDTO
  extends TenantDTO
  implements
    Omit<UserContract, "id" | "filterableEmail" | "filterablePhoneNumber">
{
  @IsString()
  public phoneNumber?: string;

  @IsString()
  public email?: string;

  @IsString()
  public password!: string;
}
