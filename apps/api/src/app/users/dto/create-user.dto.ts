import { UserContract } from "@interfaces/user.contract";
import { IntersectionType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateUserDTO 

extends IntersectionType(
  
)

implements 


Omit<UserContract, "id" | "filterableEmail">{

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  public ten
}
