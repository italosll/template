/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from "@angular/router";
import { RibbonCategoryItemComponent } from "@client/common/components/app-ribbon/app-ribbon-category-item.component";
import { TableColumnModel } from "@client/common/components/app-table/app-table-column.model";
import { RoutesContract } from "@client/common/contracts/routes.contract";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import {
  CustomRibbonItemModel,
  RibbonItemModel,
} from "@client/common/model/app-ribbon-item.model";
import { provideRibbon } from "@client/common/providers/app-provide-ribbon.provider";
import { provideDialogs } from "@client/common/providers/provide-dialogs.provider";
import { provideDisplayedColumns } from "@client/common/providers/provide-displayed-columns.provider";
import { DialogsOpenerService } from "@client/common/services/app-dialogs-opener.service";
import { DialogOpenerUtil } from "@client/common/utils/app-dialog-opener.util";
import { ProductsHttpService } from "./http/app-products.http.service";
import { DialogProductComponent } from "./pages/app-page-products-dialog-product.component";
import { provideBaseHttpService } from "@client/common/providers/app-provide-base-http-service.provider";
import { inject, provideEnvironmentInitializer } from "@angular/core";
import {
  RibbonCategoryItemDeleteComponent
} from "@client/common/components/app-ribbon/app-ribbon-category-item-delete.component";
import { DialogConfirmDeleteComponent } from "@client/common/components/app-dialog/app-dialog-confirm-delete.component";
import { provideSelectionService } from "@client/common/providers/app-provide-selection-service.provider";
import { SelectionService } from "@client/common/services/app-selection.service";
import { provideDataSourceService } from "@client/common/providers/app-provide-data-source-service.provider";
import { DataSourceService } from "@client/common/services/app-data-source.service";

// export const DisplayedColumnsToken = new InjectionToken<TableColumnModel[]>('DisplayedColumnsToken');
// function provideDisplayedColumns(displayedColumns:TableColumnModel[], displayAuditColumns = true){
//     return{
//         provide: DisplayedColumnsToken,
//         useValue: [
//             ...displayedColumns,
//             ...(displayAuditColumns ? AUDIT_TABLE_COLUMNS : []),
//         ]
//     }
// }

export function getProductsRoutes() {
  const client = {
    products: {
      title: "Estoque",
      path: "estoque",
      icon: "inventory_2",
    },
  };

  const api = {
    products: "/api/products",
  };

  const angular: Route[] = [
    {
      title: client.products.title,
      path: client.products.path,
      providers: [
        provideBaseHttpService(ProductsHttpService),
        provideDataSourceService(DataSourceService),
        provideSelectionService(SelectionService),
        provideDisplayedColumns([
          new TableColumnModel("ID", "id", "id"),
          new TableColumnModel("Código", "code", "string"),
          new TableColumnModel("Nome", "name", "string"),
          new TableColumnModel("Descrição", "description", "string"),
          new TableColumnModel("Imagem", "image", "image"),
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
                "products_create",
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
            component: DialogProductComponent,
          },
          {
            keys:["deletar"],
            component: DialogConfirmDeleteComponent,
          }
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
