export interface AssignRoleContract {
  userId: number;
  roleId: number;
  /** Omit or null for GLOBAL scope */
  tenantId?: number | null;
}
