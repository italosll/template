export interface AuditLogContract {
  id: number;
  action: string;
  resourceType?: string;
  resourceId?: string;
  userId?: number;
  tenantId?: number;
  isSuperUser: boolean;
  statusCode: number;
  executionTimeMs: number;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: string | Date;
}

export interface QueryAuditContract {
  tenantId?: number;
  userId?: number;
  resourceType?: string;
  resourceId?: string;
  action?: string;
  statusCode?: number;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
