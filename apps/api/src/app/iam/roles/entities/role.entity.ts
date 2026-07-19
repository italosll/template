import { Permission } from "@api/iam/permissions/entities/permission.entity";
import { Audit } from "@api/common/utils/audit.util";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RoleContract } from "@interfaces/role.contract";

@Entity()
export class Role extends Audit implements Omit<RoleContract, "permissionIds"> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: false,
    eager: false,
  })
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "roleId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permissionId", referencedColumnName: "id" },
  })
  permissions!: Permission[];
}
