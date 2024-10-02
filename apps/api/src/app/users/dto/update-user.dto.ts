import { UserContract } from "@template/interfaces";

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
