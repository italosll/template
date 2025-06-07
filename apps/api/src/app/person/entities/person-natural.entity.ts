import { Audit } from "@api/common/utils/audit.util";
import { Tenant } from "@api/iam/entities/tenant.entity";
import { Person } from "@api/person/entities/person.entity";
import { PersonNaturalContract } from "@interfaces/person.contract";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class PersonNatural
  extends Audit
  implements Pick<PersonNaturalContract, "id" | "birthDate">
{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  birthDate!: Date;

  @OneToOne(() => Person, (person) => person.id)
  @JoinColumn()
  personId!: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenantId!: number;
}
