import { PermissionDTO } from "@api/iam/permissions/permission.dto";
import { RoleContract } from "@interfaces/role.contract";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateRoleDTO implements Omit<RoleContract, "id"> {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDTO)
  public permissions!: PermissionDTO[];

  @IsNumber()
  public tenantId!: number;
}
