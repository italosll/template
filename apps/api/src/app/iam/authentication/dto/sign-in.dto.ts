import { SignInContract } from "@interfaces/sign-in.contract";
import { IsEmail, MinLength } from "class-validator";
export class SignInDTO implements SignInContract {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
