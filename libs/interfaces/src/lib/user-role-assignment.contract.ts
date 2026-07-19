export interface UserRoleAssignmentContract {
  id: number;
  userId: number;
  roleId: number;
  tenantId: number | null;
  role?: {
    id: number;
    name: string;
  };
}
