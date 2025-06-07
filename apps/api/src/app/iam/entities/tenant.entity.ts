import { TenantContract } from "@interfaces/tenant.contract";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";

@Entity()
export class Tenant
  extends Audit
  implements Omit<TenantContract, "companyId" | "image">
{
  @PrimaryGeneratedColumn()
  id!: number;

  // @OneToOne(() => Company, (company) => company.id)
  // @JoinColumn()
  companyId?: number;

  @Column({ nullable: true })
  s3FileKey?: string;
}
