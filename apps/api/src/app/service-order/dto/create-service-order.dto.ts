import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateServiceOrderDTO
  implements Omit<ServiceOrderContract, "id">
{
  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
