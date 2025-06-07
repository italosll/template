import { Audit } from "@api/common/utils/audit.util";
import { Tenant } from "@api/iam/entities/tenant.entity";
import { Person } from "@api/person/entities/person.entity";
import { PersonLegalContract } from "@interfaces/person.contract";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class PersonLegal
  extends Audit
  implements Pick<PersonLegalContract, "id" | "companyRealName">
{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyRealName!: string;

  @OneToOne(() => Person, (person) => person.id)
  @JoinColumn()
  personId!: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenantId!: number;
}
