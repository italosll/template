import { TenantContract } from "@interfaces/tenant.contract";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";
import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { User } from "@api/users/entities/user.entity";


@Entity()
export class Tenant
  extends Audit
  implements Omit<TenantContract, "companyId" | "image">
{
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => PersonLegal, (personLegal) => personLegal.id)
  @JoinColumn()
  personLegalId?: number;

  @Column({ nullable: true })
  s3FileKey?: string;

  @OneToMany(() => User, (user) => user.id)
  user!: User[]
}
