import { CategoryContract } from '@template/interfaces';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Audit } from '../../common/utils/audit.util';

@Entity()
export class Category extends Audit implements CategoryContract{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique:true})
  code: string;

}
