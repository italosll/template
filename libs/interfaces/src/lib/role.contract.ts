import { PermissionContract } from "./permission.contract";

export interface RoleContract {
  id: number;
  name: string;
  permissions: PermissionContract[];
  tenantId: number;
}
