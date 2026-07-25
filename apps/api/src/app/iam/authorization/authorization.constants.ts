export const PERMISSIONS_KEY = "permissions";

/** Cache key for effective permissions of a user within a tenant. */
export function permissionsCacheKey(userId: number, tenantId: number): string {
  return `permissions|userId=${userId}|tenantId=${tenantId}`;
}

/** Pattern to invalidate all tenant caches for a user. */
export function permissionsCacheUserPattern(userId: number): string {
  return `permissions|userId=${userId}|tenantId=*`;
}

/** Default TTL for cached permission sets (1 hour). */
export const PERMISSIONS_CACHE_TTL_SECONDS = 60 * 60;

/** Cache key for the SuperAdmin (GLOBAL role) flag of a user. */
export function superAdminCacheKey(userId: number): string {
  return `superadmin|userId=${userId}`;
}
