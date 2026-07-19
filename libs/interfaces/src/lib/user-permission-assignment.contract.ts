export interface UserPermissionAssignmentContract {
  id: number;
  userId: number;
  permissionId: number;
  tenantId: number | null;
  permission?: {
    id: number;
    code: string;
    description?: string;
  };
}
