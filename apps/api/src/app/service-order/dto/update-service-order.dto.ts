import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateServiceOrderDTO } from "./create-service-order.dto";

export class UpdateServiceOrderDTO
  extends CreateServiceOrderDTO
  implements ServiceOrderContract
{
  @IsNotEmpty()
  @IsNumber()
  id!: number;
}
