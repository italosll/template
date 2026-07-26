import { computed, inject, Injectable, signal } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { getAuditRoutes } from "@client/audit/app-index.routes";
import { getAuthorizationRoutes } from "@client/authorization/app-index.routes";
import { NavigationItemModel } from "@client/common/model/app-navigation-item";
import { PermissionsService } from "@client/common/services/app-permissions.service";
import { getProductsRoutes } from "@client/products/app-index.routes";
import { getStartRoutes } from "@client/start/app-index.routes";
import { getUsersRoutes } from "@client/users/app-index.routes";
import { filter, map } from "rxjs";
import { getClientsRoutes } from "../../../clients/app-index.routes";
import { getQuotationsRoutes } from "../../../quotations/app-index.routes";
import { getServiceOrdersRoutes } from "../../../service-orders/app-index.routes";

@Injectable()
export class TemplateService {
  private _router = inject(Router);
  private _permissions = inject(PermissionsService);

  private _navigationItems = signal<NavigationItemModel[]>([]);
  private _currentActiveUrl$ = this._router.events.pipe(
    takeUntilDestroyed(),
    filter((event) => event instanceof NavigationEnd),
    map((event) => (event as NavigationEnd).url)
  );

  private _currentAtiveUrl = toSignal(this._currentActiveUrl$);

  public navigationItems = computed(() => {
    const permissionsLoaded = this._permissions.loaded();
    const permissions = this._permissions.permissions();

    return this._navigationItems()
      .filter((item) => {
        if (!item.permission) {
          return true;
        }
        if (!permissionsLoaded) {
          return false;
        }
        return permissions.includes(item.permission);
      })
      .map((item) => {
        item.active = !!this._currentAtiveUrl()?.includes(item.path);
        return item;
      });
  });

  public companyRectangularLogo = computed(
    () =>
      "https://imagenes.elpais.com/resizer/v2/Y3W6QUFBBZLLTALRW6NBRPZ2RA.jpg?auth=d68f18251117888479d8fdc3210796bc86d9d3f41719da72c2877bcafc3504ea&width=1200"
  );

  constructor() {
    const routes = [
      {
        ...getStartRoutes().client.start,
        permission: undefined as string | undefined,
      },
      {
        ...getProductsRoutes().client.products,
        permission: undefined as string | undefined,
      },
      {
        ...getUsersRoutes().client.users,
        permission: undefined as string | undefined,
      },
      {
        ...getServiceOrdersRoutes().client.serviceOrders,
        permission: undefined as string | undefined,
      },
      {
        ...getClientsRoutes().client.clients,
        permission: undefined as string | undefined,
      },
      {
        ...getQuotationsRoutes().client.quotations,
        permission: undefined as string | undefined,
      },
      {
        ...getAuthorizationRoutes().client.roles,
        permission: undefined as string | undefined,
      },
      {
        ...getAuthorizationRoutes().client.permissions,
        permission: undefined as string | undefined,
      },
      {
        ...getAuthorizationRoutes().client.assignments,
        permission: undefined as string | undefined,
      },
      {
        ...getAuditRoutes().client.audits,
      },
    ];

    const navigationItems = routes.map(
      ({ title, path, icon, permission }) =>
        new NavigationItemModel(
          title,
          path,
          icon,
          false,
          true,
          true,
          permission
        )
    );
    this._navigationItems.set(navigationItems);

    this._permissions.load().subscribe();
  }
}
