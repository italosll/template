import { UserContract } from "@interfaces/user.contract";

export class UpdateUserDTO implements Partial<UserContract>{
  id:number;
  email?:string;
  password?:string;

 
}
