import { SetMetadata } from "@nestjs/common";
import { PERMISSIONS_KEY } from "../authorization.constants";

/**
 * Declares the permission(s) required to access a route handler.
 * The PermissionsGuard evaluates them against the user's effective permissions.
 *
 * @example
 * @Permissions('product.create')
 * @Permissions('product.create', 'product.update') // any of
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
