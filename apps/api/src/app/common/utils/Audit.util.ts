import { BeforeInsert, BeforeRecover, BeforeSoftRemove, BeforeUpdate, Column } from "typeorm";
import { AuditContract } from "../contracts/audit.contract";

export class Audit implements AuditContract {

  @Column({type:"datetime"})
  createdAt:Date;

  @Column({type:"datetime", nullable:true})
  updatedAt:Date;

  @Column({type:"datetime", nullable:true})
  deletedAt:Date;

  @Column({type:"datetime", nullable:true})
  recoveredAt:Date;

  @BeforeInsert()
  private _setCreatedAt(){
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  private _setUpdatedAt(){
    this.updatedAt = new Date();
  }

  @BeforeSoftRemove()
  private _setDeletedAt(){
    this.deletedAt = new Date();
  }

  @BeforeRecover()
  private _setRecoveredAt(){
    this.recoveredAt = new Date();
  }
}
