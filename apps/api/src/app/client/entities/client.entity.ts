import { Audit } from "@api/common/utils/audit.util";
import { PersonLegal } from "@api/person/entities/person-legal.entity";
import { PersonNatural } from "@api/person/entities/person-natural.entity";
import { ClientContract } from "@interfaces/client.contract";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Client extends Audit implements ClientContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => PersonLegal, (personLegal) => personLegal.id, {
    nullable: true,
  })
  @JoinColumn()
  personLegal?: PersonLegal;

  @Column({ nullable: true, unique: true })
  personLegalId?: number;

  @OneToOne(() => PersonNatural, (personNatural) => personNatural.id, {
    nullable: true,
  })
  @JoinColumn()
  personNatural?: PersonNatural;

  @Column({ nullable: true, unique: true })
  personNaturalId?: number;
}
