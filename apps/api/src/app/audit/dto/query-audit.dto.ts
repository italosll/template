import { Type } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class QueryAuditDTO {
  /** Defaults to the authenticated user's tenant when omitted. */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public tenantId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public userId?: number;

  @IsOptional()
  @IsString()
  public resourceType?: string;

  @IsOptional()
  @IsString()
  public resourceId?: string;

  @IsOptional()
  @IsString()
  public action?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public statusCode?: number;

  /** Inclusive lower bound for createdAt (ISO 8601). */
  @IsOptional()
  @IsDateString()
  public from?: string;

  /** Inclusive upper bound for createdAt (ISO 8601). */
  @IsOptional()
  @IsDateString()
  public to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit?: number;
}
