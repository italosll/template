import { TenantContract } from '@interfaces/tenant.contract';
import {  Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";
import { Company } from '../../company/entities/companies.entity';

@Entity()
export class Tenant extends Audit implements Omit<TenantContract,"companyId"> {
  @PrimaryGeneratedColumn()
  id:number;

  @OneToOne(()=> Company)
  @JoinColumn()
  company?:Company;
  
}
