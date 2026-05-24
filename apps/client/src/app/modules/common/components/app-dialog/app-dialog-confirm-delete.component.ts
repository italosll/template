import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { REFRESH_DATA } from "@client/common/constants/refresh-data.constant";
import { SelectionService } from "@client/common/services/app-selection.service";
import {
  SNACKBAR_MESSAGE_ERROR_WHEN_DELETE,
  SNACKBAR_MESSAGE_SUCCESS_WHEN_DELETE,
} from "@client/common/constants/snackbar-messages.constant";

@Component({
  selector: "app-dialog-save",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  styles:`
    .loading{
      @apply opacity-30 pointer-events-none select-none
    }
  `,
  template: `

    @if (loading()) {
      <mat-spinner style="position: absolute"
                   class="z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></mat-spinner>
    }
    <h2 mat-dialog-title>{{ "Cuidado! Esta é uma ação irreversível." }}</h2>
    <mat-dialog-content
      [class]="loading() ? 'loading' : '' "
    >
        Tem certeza que deseja deletar {{ recordAmount() }} registro{{ recordAmount() > 1 ? "s" : "" }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Não, Cancelar</button>
      <button
        mat-flat-button
        cdkFocusInitial
        type="submit"
        style="background: #e81111"
        form="form"
        color="primary"
        (click)="confirmDelete()"
      >
        Sim, deletar
      </button>
    </mat-dialog-actions>
  `,
})
export class DialogConfirmDeleteComponent<EntityType> {
  private readonly _http = inject(BaseHttpService);
  private readonly _selectionService = inject(SelectionService);
  private readonly _matDialogRef = inject(MatDialogRef);

  protected loading = this._http.loadingFind;
  protected recordAmount = computed(()=>this._selectionService.selectedItems()?.length);

  protected confirmDelete(){
    const ids = this._selectionService
      .selectedItems()
      ?.map((item: any) => item?.id);
    this._http.delete(ids).subscribe({
      next: () =>
        this._matDialogRef.close({
          ...REFRESH_DATA,
          ...SNACKBAR_MESSAGE_SUCCESS_WHEN_DELETE,
        }),
      error: () =>
        this._matDialogRef.close({
          ...REFRESH_DATA,
          ...SNACKBAR_MESSAGE_ERROR_WHEN_DELETE,
        }),
    });
  }
}
