import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateRoleDTO } from "./create-role.dto";

export class UpdateRoleDTO extends CreateRoleDTO {
  @IsNotEmpty()
  @IsNumber()
  public id!: number;
}
