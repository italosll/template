import { ProductContract } from "@interfaces/product.contract";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "../../categories/entities/category.entity";
import { Audit } from "../../common/utils/audit.util";
import { Tenant } from "../../iam/entities/tenant.entity";

@Entity()
export class Product extends Audit implements Omit<ProductContract, "image"> {
  categoryIds?: number[];
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @ManyToMany(() => Category, { nullable: false })
  @JoinTable()
  categories: Category[];

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  amount?: number;

  @Column({ nullable: true })
  cost?: number;

  @Column({ nullable: true })
  sellingPrice: number;

  @Column({ default: 0 })
  maxDiscountPercentage: number;

  @Column({ nullable: true })
  s3FileKey?: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenantId: number;
}
