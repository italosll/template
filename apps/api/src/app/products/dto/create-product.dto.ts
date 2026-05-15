import { FileContract } from "@interfaces/file.contract";
import { ProductContract } from "@interfaces/product.contract";
import { CreateTenantContract } from "@interfaces/tenant.contract";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateProductDTO  implements Omit<ProductContract, "id">, CreateTenantContract  {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public code?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsNumber()
  @IsOptional()
  public amount?: number;

  @IsNumber()
  @IsOptional()
  public cost?: number;

  @IsNumber()
  @IsOptional()
  public sellingPrice?: number;

  @IsNumber()
  @IsOptional()
  public maxDiscountPercentage?: number;

  @IsOptional()
  public image?: FileContract;

  @IsArray()
  @IsOptional()
  public categoryIds?: number[];

  @IsNumber()
  public tenantId!: number;
}
