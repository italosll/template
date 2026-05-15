import { FileContract } from "./file.contract";

export interface TenantContract {
  id: number;
  companyId: number;
  image: FileContract;
}

export interface CreateTenantContract{
  tenantId:number;
}
