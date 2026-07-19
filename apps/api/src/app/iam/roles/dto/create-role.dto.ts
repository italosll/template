import { RoleContract } from "@interfaces/role.contract";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoleDTO implements Omit<RoleContract, "id"> {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  public permissionIds!: number[];
}
