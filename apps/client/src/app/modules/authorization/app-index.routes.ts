/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from "@angular/router";
import { DialogConfirmDeleteComponent } from "@client/common/components/app-dialog/app-dialog-confirm-delete.component";
import { RibbonCategoryItemDeleteComponent } from "@client/common/components/app-ribbon/app-ribbon-category-item-delete.component";
import { RibbonCategoryItemComponent } from "@client/common/components/app-ribbon/app-ribbon-category-item.component";
import { TableColumnModel } from "@client/common/components/app-table/app-table-column.model";
import { RoutesContract } from "@client/common/contracts/routes.contract";
import { CustomRibbonItemModel } from "@client/common/model/app-ribbon-item.model";
import { provideBaseHttpService } from "@client/common/providers/app-provide-base-http-service.provider";
import { provideDataSourceService } from "@client/common/providers/app-provide-data-source-service.provider";
import { provideRibbon } from "@client/common/providers/app-provide-ribbon.provider";
import { provideSelectionService } from "@client/common/providers/app-provide-selection-service.provider";
import { provideDialogs } from "@client/common/providers/provide-dialogs.provider";
import { provideDisplayedColumns } from "@client/common/providers/provide-displayed-columns.provider";
import { DataSourceService } from "@client/common/services/app-data-source.service";
import { SelectionService } from "@client/common/services/app-selection.service";
import { DialogOpenerUtil } from "@client/common/utils/app-dialog-opener.util";
import { UsersHttpService } from "@client/users/http/app-users.http.service";
import { AuthorizationHttpService } from "./http/app-authorization.http.service";
import { PermissionsHttpService } from "./http/app-permissions.http.service";
import { RolesHttpService } from "./http/app-roles.http.service";
import { DialogPermissionComponent } from "./pages/app-page-permissions-dialog.component";
import { DialogRoleComponent } from "./pages/app-page-roles-dialog.component";

export function getAuthorizationRoutes() {
  const client = {
    roles: {
      title: "Cargos",
      path: "cargos",
      icon: "badge",
    },
    permissions: {
      title: "Permissoes",
      path: "permissoes",
      icon: "key",
    },
    assignments: {
      title: "Atribuicoes",
      path: "atribuicoes",
      icon: "manage_accounts",
    },
  };

  const api = {
    roles: "/api/roles",
    permissions: "/api/permissions",
    authorization: "/api/authorization",
  };

  const angular: Route[] = [
    {
      title: client.roles.title,
      path: client.roles.path,
      providers: [
        provideBaseHttpService(RolesHttpService),
        PermissionsHttpService,
        provideDataSourceService(DataSourceService),
        provideSelectionService(SelectionService),
        provideDisplayedColumns([
          new TableColumnModel("ID", "id", "id"),
          new TableColumnModel("Nome", "name", "string"),
        ]),
        provideRibbon([
          {
            title: "Cadastro",
            icon: "add",
            items: [
              new CustomRibbonItemModel(
                RibbonCategoryItemComponent,
                "Novo",
                "add",
                "roles_create",
                async () => await new DialogOpenerUtil().openCreateDialog(),
                true
              ),
              new CustomRibbonItemModel(RibbonCategoryItemDeleteComponent),
            ],
          },
        ]),
        provideDialogs([
          {
            keys: ["cadastrar", "editar"],
            component: DialogRoleComponent,
          },
          {
            keys: ["deletar"],
            component: DialogConfirmDeleteComponent,
          },
        ]),
      ],
      loadComponent: () =>
        import(
          "@client/common/components/templates/app-crud.template.component"
        ).then((m) => m.CrudTemplateComponent),
    },
    {
      title: client.permissions.title,
      path: client.permissions.path,
      providers: [
        provideBaseHttpService(PermissionsHttpService),
        provideDataSourceService(DataSourceService),
        provideSelectionService(SelectionService),
        provideDisplayedColumns([
          new TableColumnModel("ID", "id", "id"),
          new TableColumnModel("Codigo", "code", "string"),
          new TableColumnModel("Descricao", "description", "string"),
        ]),
        provideRibbon([
          {
            title: "Cadastro",
            icon: "add",
            items: [
              new CustomRibbonItemModel(
                RibbonCategoryItemComponent,
                "Novo",
                "add",
                "permissions_create",
                async () => await new DialogOpenerUtil().openCreateDialog(),
                true
              ),
            ],
          },
        ]),
        provideDialogs([
          {
            keys: ["cadastrar"],
            component: DialogPermissionComponent,
          },
        ]),
      ],
      loadComponent: () =>
        import(
          "@client/common/components/templates/app-crud.template.component"
        ).then((m) => m.CrudTemplateComponent),
    },
    {
      title: client.assignments.title,
      path: client.assignments.path,
      providers: [
        AuthorizationHttpService,
        UsersHttpService,
        RolesHttpService,
        PermissionsHttpService,
      ],
      loadComponent: () =>
        import("./pages/app-page-assignments.component").then(
          (m) => m.AssignmentsPageComponent
        ),
    },
  ];

  return {
    client,
    api,
    angular,
  } satisfies RoutesContract;
}
