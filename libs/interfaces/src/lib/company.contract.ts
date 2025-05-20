import { FileContract } from "./file.contract";

export interface CompanyContract {
  id: number;
  fantasyName: string;
  companyName: string;
  cnpj: string;
  image: FileContract;
}
