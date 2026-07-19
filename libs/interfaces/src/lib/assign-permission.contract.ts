export interface AssignPermissionContract {
  userId: number;
  permissionId: number;
  /** Omit or null for GLOBAL scope */
  tenantId?: number | null;
}
