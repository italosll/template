import { QuotationServiceOrderContract } from "@interfaces/quotation-service-order.contract";
import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class CreateQuotationServiceOrderDTO
  implements Omit<QuotationServiceOrderContract, "id">
{
  @IsNotEmpty()
  @IsNumber()
  serviceOrderId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}
