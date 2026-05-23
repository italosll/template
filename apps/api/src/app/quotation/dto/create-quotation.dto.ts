import { QuotationContract } from "@interfaces/quotation.contract";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateQuotationDTO implements Omit<QuotationContract, "id"> {
  @IsNotEmpty()
  @IsNumber()
  clientId!: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  productIds!: number[];

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  serviceOrderIds!: number[];

  @IsOptional()
  @IsString()
  observation?: string;
}
