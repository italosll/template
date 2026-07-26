/**
 * Catalog of permission codes shared across the platform (API and client).
 * Format: `{resource}.{action}` (e.g. `product.create`).
 */
export const PERMISSION_CODES = {
  PRODUCT_CREATE: "product.create",
  PRODUCT_READ: "product.read",
  PRODUCT_UPDATE: "product.update",
  PRODUCT_DELETE: "product.delete",
  USER_CREATE: "user.create",
  USER_READ: "user.read",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",
  USER_MANAGE: "user.manage",
  ROLE_CREATE: "role.create",
  ROLE_READ: "role.read",
  ROLE_UPDATE: "role.update",
  ROLE_DELETE: "role.delete",
  PERMISSION_MANAGE: "permission.manage",
  AUDIT_READ: "audit.read",
} as const;

export type PermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];

export const ALL_PERMISSION_CODES: PermissionCode[] =
  Object.values(PERMISSION_CODES);
