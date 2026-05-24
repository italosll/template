
import {SelectionModel} from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  input,
  effect,
  runInInjectionContext,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { DisplayedColumnsToken } from "@client/common/providers/provide-displayed-columns.provider";
import { DialogOpenerUtil } from "@client/common/utils/app-dialog-opener.util";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { SelectionService } from "@client/common/services/app-selection.service";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-table",
  imports: [MatCheckboxModule, FormsModule, MatTableModule, MatProgressBarModule],
  styles:`
    /* Keyframes for entering */
    @keyframes rowEnter {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Keyframes for leaving */
    @keyframes rowLeave {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }


    .enter-animation {
      opacity: 0;
      animation: slide-fade 400ms;
      animation-delay: calc(var(--i) * 100ms);

      .mat-mdc-cell{
        border-bottom-width:0;
      }
    }
    @keyframes slide-fade {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

  `,
  template: `
    @if(loaging()){
      <mat-progress-bar class="min" mode="indeterminate"></mat-progress-bar>
    }
    <div class="overflow-x-auto">
      <table mat-table [dataSource]="items()">

        <!-- Checkbox Column -->
        <ng-container matColumnDef="select">
          <th mat-header-cell *matHeaderCellDef>
            <mat-checkbox (change)="$event ? selectionService.toggleAll() : null"
                          [checked]="selectionService.hasValue() && selectionService.isAllSelected()"
                          [indeterminate]="selectionService.hasValue() && !selectionService.isAllSelected()"
                          [aria-label]="checkboxLabel()">
            </mat-checkbox>
          </th>
          <td mat-cell *matCellDef="let row;">
            <mat-checkbox (click)="$event.stopPropagation()"
                          (change)="$event ? selectionService.toggle(row) : null"
                          [checked]="selectionService.isSelected(row)"
                          [aria-label]="checkboxLabel(row)"
                          [attr.data-testid]="'checkbox'">
            </mat-checkbox>
          </td>
        </ng-container>

        @for(column of columns; track column.name){
          <ng-container [matColumnDef]="column.name">
            <th mat-header-cell *matHeaderCellDef>{{ column?.title }}</th>
            <td mat-cell *matCellDef="let element">
              @if(column.type === 'image'){
                <img
                  width="50px"
                  height="50px"
                  [src]="element?.[column.name]?.url"
                  alt="Imagem"
                />
              } @else {
                {{ element?.[column.name]}}
              }
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
<!--          animate.enter="enter-animation"-->
        <tr
          mat-row
          *matRowDef="let row;  let i = index; columns: displayedColumns"
          [style.--i]="i"
          (click)="openUpdateDialog(row.id)"
        ></tr>

      </table>
    </div>

  `,
})
export class TableComponent {
  private readonly _injector = inject(Injector);
  private readonly _http = inject(BaseHttpService);
  protected readonly selectionService = inject(SelectionService);


  protected readonly loaging = computed(()=>this._http.loadingFind())

  items = input.required<object[]>();
  columns = inject(DisplayedColumnsToken);
  displayedColumns = ["select",...this.columns.map((column) => column.name)];

  constructor() {

    effect(() => {
      this.selectionService.setItems(this.items())
    });
  }
  // /** Whether the number of selected elements matches the total number of rows. */
  // protected isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.items().length;
  //   return numSelected === numRows;
  // }
  //
  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // protected toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     return;
  //   }
  //
  //   this.selection.select(...this.items());
  // }

  /** The label for the checkbox on the passed row */
  protected checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.selectionService.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionService.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  protected async openUpdateDialog(id: number) {
    runInInjectionContext(this._injector, async () => {
      await new DialogOpenerUtil().openUpdateDialog(id);
    });
  }
}
