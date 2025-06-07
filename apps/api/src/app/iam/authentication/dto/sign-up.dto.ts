import { IsEmail, MinLength } from "class-validator";

export class SignUpDTO {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
