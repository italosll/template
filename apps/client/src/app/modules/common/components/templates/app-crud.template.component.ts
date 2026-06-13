
import {
  ChangeDetectionStrategy,
  Component, computed,
  DestroyRef,
  inject,
} from "@angular/core";
import { MatDialog} from "@angular/material/dialog";
import { RibbonCategoryContract } from "@client/common/contracts/ribbon.contract";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { RibbonCategoriesContractToken } from "@client/common/providers/app-provide-ribbon.provider";
import { DialogsOpenerService } from "@client/common/services/app-dialogs-opener.service";
import { RibbonComponent } from "../app-ribbon/app-ribbon.component";
import { TableComponent } from "../app-table/app-table.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { REFRESH_DATA } from "@client/common/constants/refresh-data.constant";
import { SearchBarComponent } from "@client/common/components/app-input-search/app-search-file.component";
import { DataSourceService } from "@client/common/services/app-data-source.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarMessageInterface } from "@client/common/constants/snackbar-messages.constant";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, RibbonComponent, SearchBarComponent],
  providers: [
    DialogsOpenerService,
  ],
  styles: [
    `
        :host {
          display: flex;
          flex-direction: column;
        }
    `
  ],
  template: `
    <app-ribbon [categories]="categories" />
    <app-search-bar style="margin-top: 20px"/>
    <app-table [items]="items()" />
  `,
})
export class CrudTemplateComponent {
  private readonly _http = inject(BaseHttpService);
  private readonly _matDialog = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef)
  private readonly _dataSource = inject(DataSourceService);
  private readonly _ribbonCategories = inject(RibbonCategoriesContractToken);
  private readonly _snackBar = inject(MatSnackBar);

  protected readonly items = computed(()=> this._dataSource.dataSource())
  protected readonly categories: RibbonCategoryContract[] = this._ribbonCategories;

  constructor() {
    inject(DialogsOpenerService);
    this._matDialog.afterOpened.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((dialog)=> {
      dialog.afterClosed().pipe(takeUntilDestroyed(this._destroyRef)).subscribe((response)=>{
        if((response as typeof REFRESH_DATA)?.refresh) this._fetchData()
        if((response as SnackbarMessageInterface)?.snackbarMessage) this._snackBar.open((response as SnackbarMessageInterface)?.snackbarMessage, undefined ,{duration:3000})
      })
    })
  }

  private _fetchData(){
    this._http.findAll().subscribe((r) => this._dataSource.setData(r));
  }
}
