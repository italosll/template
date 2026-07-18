import { Audit } from "@api/common/utils/audit.util";
import { QuotationContract } from "@interfaces/quotation.contract";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Client } from "../../client/entities/client.entity";
import { QuotationProduct } from "./quotation-product.entity";
import { QuotationServiceOrder } from "./quotation-service-order.entity";

@Entity()
export class Quotation
  extends Audit
  implements Omit<QuotationContract, "products" | "serviceOrders">
{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: "clientId" })
  client!: Client;

  @RelationId((quotation: Quotation) => quotation.client)
  clientId!: number;

  @OneToMany(
    () => QuotationProduct,
    (quotationProduct) => quotationProduct.quotation,
    {
      cascade: true,
      orphanedRowAction: "delete",
    },
  )
  products?: QuotationProduct[];

  @OneToMany(
    () => QuotationServiceOrder,
    (quotationServiceOrder) => quotationServiceOrder.quotation,
    {
      cascade: true,
      orphanedRowAction: "delete",
    },
  )
  serviceOrders?: QuotationServiceOrder[];

  @Column({ nullable: true })
  observation?: string;
}
