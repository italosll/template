import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  input,
  runInInjectionContext,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { DisplayedColumnsToken } from "@client/common/providers/provide-displayed-columns.provider";
import { DialogOpenerUtil } from "@client/common/utils/app-dialog-opener.util";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-table",
  imports: [CommonModule, FormsModule, MatTableModule],
  template: `
    <table mat-table [dataSource]="items()">
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
          }@else {
          {{ element?.[column.name]}}
          }
        </td>
      </ng-container>
      }

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: displayedColumns"
        (click)="openUpdateDialog(row.id)"
      ></tr>
    </table>
  `,
})
export class TableComponent {
  private _injector = inject(Injector);
  items = input.required<object[]>();
  columns = inject(DisplayedColumnsToken);
  displayedColumns = this.columns.map((column) => column.name);

  protected async openUpdateDialog(id: number) {
    runInInjectionContext(this._injector, async () => {
      console.log("id", id);
      await new DialogOpenerUtil().openUpdateDialog(id);
    });
  }
}
