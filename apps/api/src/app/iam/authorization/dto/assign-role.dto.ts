import { IsInt, IsOptional, IsPositive, ValidateIf } from "class-validator";

export class AssignRoleDto {
  @IsInt()
  @IsPositive()
  userId!: number;

  @IsInt()
  @IsPositive()
  roleId!: number;

  /**
   * Tenant scope. Omit or null for GLOBAL (Super Admin / cross-tenant).
   */
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsOptional()
  @IsInt()
  @IsPositive()
  tenantId?: number | null;
}
