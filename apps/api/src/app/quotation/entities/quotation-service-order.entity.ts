import { Audit } from "@api/common/utils/audit.util";
import { QuotationServiceOrderContract } from "@interfaces/quotation-service-order.contract";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ServiceOrder } from "../../service-order/entities/service-order.entity";
import { Quotation } from "./quotation.entity";

@Entity()
export class QuotationServiceOrder
  extends Audit
  implements QuotationServiceOrderContract
{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Quotation, (quotation) => quotation.serviceOrders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "quotationId" })
  quotation!: Quotation;

  @RelationId(
    (quotationServiceOrder: QuotationServiceOrder) =>
      quotationServiceOrder.quotation
  )
  quotationId!: number;

  @ManyToOne(() => ServiceOrder, { nullable: false })
  @JoinColumn({ name: "serviceOrderId" })
  serviceOrder!: ServiceOrder;

  @RelationId(
    (quotationServiceOrder: QuotationServiceOrder) =>
      quotationServiceOrder.serviceOrder
  )
  serviceOrderId!: number;

  @Column()
  amount!: number;

  @Column()
  price!: number;

  @Column({ default: 0 })
  discount!: number;
}
