import { Audit } from "@api/common/utils/audit.util";
import { Product } from "@api/products/entities/product.entity";
import { QuotationContract } from "@interfaces/quotation.contract";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Client } from "../../client/entities/client.entity";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";

@Entity()
export class Quotation extends Audit implements QuotationContract {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Client, (client) => client.id, { nullable: false })
  @JoinColumn()
  client!: Client;

  @Column()
  clientId!: number;

  @ManyToMany(() => Product, { nullable: true })
  @JoinTable()
  products?: Product[];

  @RelationId((quotation: Quotation) => quotation.products)
  productIds!: number[];

  @ManyToMany(() => ServiceOrder, { nullable: true })
  @JoinTable()
  serviceOrders?: ServiceOrder[];

  @RelationId((quotation: Quotation) => quotation.serviceOrders)
  serviceOrderIds!: number[];

  @Column({ nullable: true })
  observation?: string;
}
