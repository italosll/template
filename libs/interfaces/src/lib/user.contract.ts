export interface UserContract{
  id:number;
  email:string;
  filterableEmail:string;
  password:string;

  createdAt?:Date;
  updatedAt?:Date;
  deletedAt?:Date;
  recoveredAt?:Date;

}
