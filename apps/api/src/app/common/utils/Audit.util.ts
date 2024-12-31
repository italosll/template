import { BeforeRecover, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { AuditContract } from "../contracts/audit.contract";

export class Audit implements AuditContract {

  @CreateDateColumn({type:"datetime"})
  createdAt:Date;

  @UpdateDateColumn({type:"datetime", nullable:true})
  updatedAt:Date;

  @DeleteDateColumn({type:"datetime", nullable:true})
  deletedAt:Date;

  @Column({type:"datetime", nullable:true})
  recoveredAt:Date;

  @BeforeRecover()
  private _setRecoveredAt(){
    this.recoveredAt = new Date();
  }
}
