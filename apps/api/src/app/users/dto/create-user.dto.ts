import { UserContract } from "@template/interfaces";
import { IsString } from "class-validator";

export class CreateUserDTO implements Omit<UserContract, "id" | "filterableEmail">{

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  constructor(partial: Partial<CreateUserDTO>) {
    Object.assign(this, partial);
  }
}
