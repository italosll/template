import { IProduct } from '@template/interfaces';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from "../../common/utils/audit.util";


@Entity()
export class Product extends Audit implements IProduct {

  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  name:string;

  @Column({unique:true})
  code:string;

  // @Column()
  // category:string; implement the category resource

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
  imageURls:string[];

}
