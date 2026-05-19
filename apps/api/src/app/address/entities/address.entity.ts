import { AddressContract } from "@interfaces/address.contract";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";
import { Person } from "../../person/entities/person.entity";

@Entity()
export class Address extends Audit implements AddressContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  streetAddress!: string;

  @Column()
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  postalCode!: string;

  @Column()
  country!: string;

  @OneToOne(() => Person, (person) => person.id)
  @JoinColumn()
  person!: Person;

  @Column({ unique: true })
  personId!: number;
}
