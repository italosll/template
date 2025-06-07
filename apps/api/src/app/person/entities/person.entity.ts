import { Audit } from "@api/common/utils/audit.util";
import { Tenant } from "@api/iam/entities/tenant.entity";
import { PersonContract } from "@interfaces/person.contract";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Person extends Audit implements PersonContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column({ unique: true })
  document!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenantId!: number;
}
