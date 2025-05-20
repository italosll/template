import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CompanyContract } from '@interfaces/company.contract';
import { Tenant } from "../../iam/entities/tenant.entity";
import { Audit } from "../../common/utils/audit.util";



@Entity()
export class Company extends Audit implements Partial<CompanyContract> {

  @PrimaryGeneratedColumn()
  id:number;

  @Column({unique:true})
  cnpj:string;

  @Column()
  companyName:string;

  @Column()
  fantasyName:string;

  @Column({nullable:true})
  s3FileKey?:string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenantId: number;
}
