import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";

@Entity()
export class ServiceOrder extends Audit implements ServiceOrderContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
  })
  description!: string;

  @Column()
  price!: number;
}
