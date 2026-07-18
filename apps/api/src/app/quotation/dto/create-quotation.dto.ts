import { QuotationContract } from "@interfaces/quotation.contract";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateQuotationProductDTO } from "./create-quotation-product.dto";
import { CreateQuotationServiceOrderDTO } from "./create-quotation-service-order.dto";

export class CreateQuotationDTO implements Omit<QuotationContract, "id"> {
  @IsNotEmpty()
  @IsNumber()
  clientId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationProductDTO)
  products!: CreateQuotationProductDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationServiceOrderDTO)
  serviceOrders!: CreateQuotationServiceOrderDTO[];

  @IsOptional()
  @IsString()
  observation?: string;
}
