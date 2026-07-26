/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from "@angular/router";
import { permissionGuard } from "@client/common/guards/app-permission.guard";
import { PERMISSION_CODES } from "@interfaces/permission-code.contract";
import { AuditHttpService } from "./http/app-audit.http.service";

export function getAuditRoutes() {
  const client = {
    audits: {
      title: "Auditoria",
      path: "auditoria",
      icon: "history",
      permission: PERMISSION_CODES.AUDIT_READ,
    },
  };

  const api = {
    audits: "/api/audits",
  };

  const angular: Route[] = [
    {
      title: client.audits.title,
      path: client.audits.path,
      canActivate: [permissionGuard(PERMISSION_CODES.AUDIT_READ)],
      providers: [AuditHttpService],
      loadComponent: () =>
        import("./pages/app-page-audit.component").then(
          (m) => m.AuditPageComponent
        ),
    },
  ];

  return {
    client,
    api,
    angular,
  };
}
