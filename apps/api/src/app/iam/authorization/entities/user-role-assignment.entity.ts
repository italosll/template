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
import { Role } from "@api/iam/roles/entities/role.entity";
import { Tenant } from "@api/iam/entities/tenant.entity";

/**
 * Assigns a role to a user within a scope.
 * `tenantId = null` means GLOBAL (applies to every tenant).
 */
@Entity()
@Unique(["userId", "roleId", "tenantId"])
@Index(["userId", "tenantId"])
export class UserRoleAssignment extends Audit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Role, { onDelete: "CASCADE" })
  @JoinColumn({ name: "roleId" })
  role!: Role;

  @Column()
  roleId!: number;

  @ManyToOne(() => Tenant, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant?: Tenant | null;

  /** null = GLOBAL scope */
  @Column({ nullable: true })
  tenantId!: number | null;
}
