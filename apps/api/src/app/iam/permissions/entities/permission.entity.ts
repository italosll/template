import { PermissionContract } from "@interfaces/permission.contract";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "@api/common/utils/audit.util";
import { Role } from "@api/iam/roles/entities/role.entity";

@Entity()
export class Permission extends Audit implements PermissionContract {
  @PrimaryGeneratedColumn()
  id!: number;

  /** Atomic permission code, e.g. `product.create` */
  @Column({ unique: true })
  code!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];
}
