import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { TableComponent } from "../app-table/app-table.component";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { MatDialog } from "@angular/material/dialog";
import { RibbonComponent } from "../app-ribbon/app-ribbon.component";
import { RibbonCategoryContract } from "@client/common/contracts/ribbon.contract";
import { DialogsOpenerService } from "@client/common/services/app-dialogs-opener.service";
import { RibbonCategoriesContractToken } from "@client/common/providers/app-provide-ribbon.provider";
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    CommonModule,
    TableComponent,
    RibbonComponent
],
    template: `
        <app-ribbon  [categories]="categories"/>
        <app-table [items]="items()"/>
    `
})
export class CrudTemplateComponent{ 
  private readonly _http = inject(BaseHttpService);
  public readonly dialogsOpener = inject(DialogsOpenerService);

  private readonly _ribbonCategories = inject(RibbonCategoriesContractToken);
  
  protected readonly items = signal<any[]>([]);
  readonly dialog = inject(MatDialog);

  readonly categories: RibbonCategoryContract[] = this._ribbonCategories; 
  // [
  //   {
  //     title: "Cadastro",
  //     icon: "add",
  //     items: [
  //       { title: "Novo", icon: "add", permissionName: "products_create", enabled: true, click: async () => await this._dialogOpener.openCreateDialog() },
  //       { title: "Excluir", icon: "delete", permissionName: "products_delete", enabled: true },
  //     ],
  //   }
  // ]  
  constructor(){
      this._http.findAll().subscribe((r)=>this.items.set(r));
  }
}