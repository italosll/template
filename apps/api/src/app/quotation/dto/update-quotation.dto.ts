import { QuotationContract } from "@interfaces/quotation.contract";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateQuotationDTO } from "./create-quotation.dto";

export class UpdateQuotationDTO
  extends CreateQuotationDTO
  implements QuotationContract
{
  @IsNotEmpty()
  @IsNumber()
  id!: number;
}
