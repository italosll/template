import { UserContract } from "@interfaces/user.contract";

export class UpdateUserDTO implements Partial<UserContract>{
  id:number;
  email?:string;
  password?:string;

  constructor(updateUserDTO:UpdateUserDTO){
    this.id = updateUserDTO.id;
    this.email = updateUserDTO.email;
    this.password = updateUserDTO.password;
  }
}
