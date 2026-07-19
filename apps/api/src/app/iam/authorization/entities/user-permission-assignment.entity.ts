import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Audit } from "@api/common/utils/audit.util";
import { User } from "@api/users/entities/user.entity";
import { Permission } from "@api/iam/permissions/entities/permission.entity";
import { Tenant } from "@api/iam/entities/tenant.entity";

/**
 * Assigns a permission directly to a user within a scope.
 * `tenantId = null` means GLOBAL (applies to every tenant).
 */
@Entity()
@Unique(["userId", "permissionId", "tenantId"])
@Index(["userId", "tenantId"])
export class UserPermissionAssignment extends Audit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Permission, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permissionId" })
  permission!: Permission;

  @Column()
  permissionId!: number;

  @ManyToOne(() => Tenant, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant?: Tenant | null;

  /** null = GLOBAL scope */
  @Column({ nullable: true })
  tenantId!: number | null;
}
