import { ProductContract } from '@interfaces/product.contract';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";
import { Category } from "../../categories/entities/category.entity";



@Entity()
export class Product extends Audit implements Omit<ProductContract, "image"> {

  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  name:string;

  @Column({unique:true})
  code:string;

  @ManyToMany(()=> Category, { nullable:false })
  @JoinTable()
  categories: Category[];

  @Column()
  description:string;

  @Column()
  amount:number;

  @Column()
  cost:number;

  @Column()
  sellingPrice:number;

  @Column({default:0})
  maxDiscountPercentage:number

  @Column()
  s3FileKey:string;
}
