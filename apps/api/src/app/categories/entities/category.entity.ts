import { CategoryContract } from "@interfaces/category.contract";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";
import { Tenant } from "../../iam/entities/tenant.entity";
import { CreateTenantContract } from "@interfaces/tenant.contract";

@Entity()
export class Category extends Audit implements CategoryContract, CreateTenantContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  code!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant!: Tenant;

  @Column({ nullable: true })
  tenantId!: number

}
