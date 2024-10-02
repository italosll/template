import { UserContract } from "@template/interfaces";

export class CreateUserDTO implements Omit<UserContract, "id" | "filterableEmail">{
  public email: string;
  public password: string;

  constructor(createUserDTO:CreateUserDTO){
    this.email = createUserDTO.email;
    this.password = createUserDTO.password;
  }
}
