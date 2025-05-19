import { ImageContract } from "./image.contract";

export interface CompanyContract{
  id:number;
  fantasyName:string;
  companyName:string;
  cnpj:string;
  image:ImageContract
}
