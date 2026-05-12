/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from "@angular/router";
import { TableColumnModel } from "@client/common/components/app-table/app-table-column.model";
import { RoutesContract } from "@client/common/contracts/routes.contract";
import { RibbonItemModel } from "@client/common/model/app-ribbon-item.model";
import { provideBaseHttpService } from "@client/common/providers/app-provide-base-http-service.provider";
import { provideDataSourceService } from "@client/common/providers/app-provide-data-source-service.provider";
import { provideRibbon } from "@client/common/providers/app-provide-ribbon.provider";
import { provideSelectionService } from "@client/common/providers/app-provide-selection-service.provider";
import { provideDialogs } from "@client/common/providers/provide-dialogs.provider";
import { provideDisplayedColumns } from "@client/common/providers/provide-displayed-columns.provider";
import { DataSourceService } from "@client/common/services/app-data-source.service";
import { DialogsOpenerService } from "@client/common/services/app-dialogs-opener.service";
import { SelectionService } from "@client/common/services/app-selection.service";
import { DialogOpenerUtil } from "@client/common/utils/app-dialog-opener.util";
import { DialogUsersComponent } from "@client/users/pages/app-page-users-dialog.component";
import { UsersHttpService } from "./http/app-users.http.service";

export function getUsersRoutes() {
  const client = {
    users: {
      title: "Usuários",
      path: "usuarios",
      icon: "people",
    },
  };

  const api = {
    users: "/api/users",
  };

  const angular: Route[] = [
    {
      title: client.users.title,
      path: client.users.path,
      providers: [
        DialogsOpenerService,
        // provideEnvironmentInitializer(()=> inject(DialogsOpenerService)),
        provideDataSourceService(DataSourceService),
        provideSelectionService(SelectionService),
        
        provideBaseHttpService(UsersHttpService),
        provideDisplayedColumns([
          new TableColumnModel("ID", "id", "id"),
          new TableColumnModel("Email", "email", "string"),
        ]),
        provideRibbon([
          {
            title: "Cadastro",
            icon: "add",
            items: [
              new RibbonItemModel(
                "Novo",
                "add",
                "users_create",
                async () => await new DialogOpenerUtil().openCreateDialog(),
                true
              ),
              new RibbonItemModel(
                "Excluir",
                "delete",
                "products_delete",
                async () => console.log("Excluir"),
                true
              ),
            ],
          },
        ]),
        provideDialogs([
          {
            keys: ["cadastrar", "editar"],
            component: DialogUsersComponent,
          },
        ]),
      ],
      loadComponent: () =>
        import(
          "@client/common/components/templates/app-crud.template.component"
        ).then((m) => m.CrudTemplateComponent),
    },
  ];

  return {
    client,
    api,
    angular,
  } satisfies RoutesContract;
}
