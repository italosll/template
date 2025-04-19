import { IsEmail, MinLength } from "class-validator";
import { SignInContract } from "@interfaces/sign-in.contract";
export class SignInDTO implements SignInContract{

  @IsEmail()
  email:string;

  @MinLength(8)
  password:string
}
