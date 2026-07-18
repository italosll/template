import { Audit } from "@api/common/utils/audit.util";
import { Product } from "@api/products/entities/product.entity";
import { QuotationProductContract } from "@interfaces/quotation-product.contract";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Quotation } from "./quotation.entity";

@Entity()
export class QuotationProduct
  extends Audit
  implements QuotationProductContract
{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Quotation, (quotation) => quotation.products, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "quotationId" })
  quotation!: Quotation;

  @RelationId((quotationProduct: QuotationProduct) => quotationProduct.quotation)
  quotationId!: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @RelationId((quotationProduct: QuotationProduct) => quotationProduct.product)
  productId!: number;

  @Column({ nullable: true })
  manufacturer?: string;

  @Column({ nullable: true })
  unity?: string;

  @Column()
  amount!: number;

  @Column()
  price!: number;

  @Column({ default: 0 })
  discount!: number;
}
