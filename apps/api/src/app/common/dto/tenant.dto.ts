import { IsNumber } from "class-validator";

export class TenantDTO{
  @IsNumber()
  tenantId:number;
}
