import { PermissionContract } from "@interfaces/permission.contract";
import { PERMISSIONS } from "@api/iam/permissions/permissions.constant";

export function toPermissionKey(permission: PermissionContract): string {
  return `${permission.resource}:${permission.action}`;
}

export function getAllowedPermissionKeys(): Set<string> {
  return new Set(PERMISSIONS.map((permission) => toPermissionKey(permission)));
}
