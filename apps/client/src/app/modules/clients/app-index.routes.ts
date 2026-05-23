/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from "@angular/router";
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
import { RibbonCategoryItemComponent } from "@client/common/components/app-ribbon/app-ribbon-category-item.component";
import { RibbonCategoryItemDeleteComponent } from "@client/common/components/app-ribbon/app-ribbon-category-item-delete.component";
import { DialogConfirmDeleteComponent } from "@client/common/components/app-dialog/app-dialog-confirm-delete.component";
import { ClientsHttpService } from "./http/app-clients.http.service";
import { DialogClientComponent } from "./pages/app-page-clients-dialog.component";

export function getClientsRoutes() {
  const client = {
    clients: {
      title: "Clientes",
      path: "clientes",
      icon: "group",
    },
  };

  const api = {
    clients: "/api/clients",
  };

  const angular: Route[] = [
    {
      title: client.clients.title,
      path: client.clients.path,
      providers: [
        provideBaseHttpService(ClientsHttpService),
        provideDataSourceService(DataSourceService),
        provideSelectionService(SelectionService),
        provideDisplayedColumns([
          new TableColumnModel("ID", "id", "id"),
          new TableColumnModel("Pessoa juridica", "personLegalId", "string"),
          new TableColumnModel("Pessoa fisica", "personNaturalId", "string"),
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
                "clients_create",
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
            component: DialogClientComponent,
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
  ];

  return {
    client,
    api,
    angular,
  } satisfies RoutesContract;
}
