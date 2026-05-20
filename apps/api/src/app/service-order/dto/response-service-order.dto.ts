import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { AuditContract } from "../../common/contracts/audit.contract";

export class ResponseServiceOrderDTO
  implements ServiceOrderContract, AuditContract
{
  id!: number;
  description!: string;
  price!: number;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
  recoveredAt!: Date;
}
