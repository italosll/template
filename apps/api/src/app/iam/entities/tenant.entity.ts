import { TenantContract } from '@interfaces/tenant.contract';
import {  Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from '../../company/entities/companies.entity';
import { Audit } from '../../common/utils/audit.util';

@Entity()
export class Tenant extends Audit implements Omit<TenantContract,"companyId"> {
  @PrimaryGeneratedColumn()
  id:number;

  @OneToOne(()=> Company)
  @JoinColumn()
  company?:Company;
  
}
