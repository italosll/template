import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { getIamRoutes } from "@client/iam/app-index.routes";
import { getStartRoutes } from "@client/start/app-index.routes";
import { catchError, map, of } from "rxjs";
import { PermissionsService } from "../services/app-permissions.service";

/**
 * Requires the authenticated user to hold the given permission code.
 * Loads `/authorization/me` when the session is not yet cached.
 */
export function permissionGuard(permission: string): CanActivateFn {
  return () => {
    const permissionsService = inject(PermissionsService);
    const router = inject(Router);
    const startPath = getStartRoutes().client.start.path;
    const signInPath = getIamRoutes().client.signIn.path;

    if (permissionsService.loaded()) {
      return permissionsService.hasPermission(permission)
        ? true
        : router.createUrlTree([startPath]);
    }

    return permissionsService.load().pipe(
      map((session) =>
        session.permissions.includes(permission)
          ? true
          : router.createUrlTree([startPath])
      ),
      catchError(() => of(router.createUrlTree([signInPath])))
    );
  };
}
