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
import { ClientsHttpService } from "../clients/http/app-clients.http.service";
import { ProductsHttpService } from "../products/http/app-products.http.service";
import { ServiceOrdersHttpService } from "../service-orders/http/app-service-orders.http.service";
import { QuotationsHttpService } from "./http/app-quotations.http.service";
import { DialogQuotationComponent } from "./pages/app-page-quotations-dialog.component";

export function getQuotationsRoutes() {
  const client = {
    quotations: {
      title: "Orcamentos",
      path: "orcamentos",
      icon: "request_quote",
    },
  };

  const api = {
    quotations: "/api/quotations",
  };

  const angular: Route[] = [
    {
      title: client.quotations.title,
      path: client.quotations.path,
      providers: [
        provideBaseHttpService(QuotationsHttpService),
        ClientsHttpService,
        ProductsHttpService,
        ServiceOrdersHttpService,
        provideDataSourceService(DataSourceService),
        provideSelectionService(SelectionService),
        provideDisplayedColumns([
          new TableColumnModel("ID", "id", "id"),
          new TableColumnModel("Cliente", "clientId", "string"),
          new TableColumnModel("Observacao", "observation", "string"),
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
                "quotations_create",
                async () => await new DialogOpenerUtil().openCreateDialog(),
                true,
              ),
              new CustomRibbonItemModel(RibbonCategoryItemDeleteComponent),
            ],
          },
        ]),
        provideDialogs([
          {
            keys: ["cadastrar", "editar"],
            component: DialogQuotationComponent,
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
