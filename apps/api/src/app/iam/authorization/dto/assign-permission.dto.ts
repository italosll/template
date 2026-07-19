import { IsInt, IsOptional, IsPositive, ValidateIf } from "class-validator";

export class AssignPermissionDto {
  @IsInt()
  @IsPositive()
  userId!: number;

  @IsInt()
  @IsPositive()
  permissionId!: number;

  /**
   * Tenant scope. Omit or null for GLOBAL (Super Admin / cross-tenant).
   */
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsOptional()
  @IsInt()
  @IsPositive()
  tenantId?: number | null;
}
