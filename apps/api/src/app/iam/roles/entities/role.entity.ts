import { RoleContract } from "@interfaces/role.contract";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "@api/common/utils/audit.util";
import { PermissionContract } from "@interfaces/permission.contract";
import { Tenant } from "@api/iam/entities/tenant.entity";

@Entity()
export class Role extends Audit implements RoleContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "json" })
  permissions!: PermissionContract[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenantId!: number;
}
