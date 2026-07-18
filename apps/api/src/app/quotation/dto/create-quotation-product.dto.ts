import { QuotationProductContract } from "@interfaces/quotation-product.contract";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateQuotationProductDTO
  implements Omit<QuotationProductContract, "id">
{
  @IsNotEmpty()
  @IsNumber()
  productId!: number;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  unity?: string;

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
