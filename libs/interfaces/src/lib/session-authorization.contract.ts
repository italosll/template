export interface SessionAuthorizationContract {
  userId: number;
  tenantId: number;
  email?: string;
  permissions: string[];
}
