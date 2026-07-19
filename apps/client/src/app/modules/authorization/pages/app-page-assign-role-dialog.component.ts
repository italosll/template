import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { submit } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { REFRESH_DATA } from "@client/common/constants/refresh-data.constant";
import { firstValueFrom } from "rxjs";
import { AuthorizationHttpService } from "../http/app-authorization.http.service";
import { AssignRoleModel } from "../models/app-assign-role.model";

@Component({
  selector: "app-page-assign-role-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    FormularyComponent,
    MatProgressSpinnerModule,
  ],
  template: `
    @if (formModel.ready()) {
      @if (loading()) {
        <mat-spinner
          style="position: absolute"
          class="z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        ></mat-spinner>
      }
      <h2 mat-dialog-title>Atribuir cargo</h2>
      <mat-dialog-content [class.opacity-30]="loading()">
        <form
          id="assign-role-form"
          app-formulary
          [formModel]="formModel"
          (submit)="onSubmit($event)"
        ></form>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Fechar</button>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          form="assign-role-form"
          [disabled]="formModel.form().invalid() || formModel.form().pending()"
        >
          Salvar
        </button>
      </mat-dialog-actions>
    } @else {
      <mat-spinner
        style="position: absolute"
        class="z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      ></mat-spinner>
    }
  `,
})
export class DialogAssignRoleComponent {
  private readonly _http = inject(AuthorizationHttpService);
  private readonly _dialogRef = inject(MatDialogRef);

  protected formModel = new AssignRoleModel();
  protected loading = this._http.loading;

  protected onSubmit(event: Event) {
    event.preventDefault();

    submit(this.formModel.form, async () => {
      const value = this.formModel.value();
      const tenantId =
        value.scope === "global"
          ? null
          : value.tenantId
            ? Number(value.tenantId)
            : null;

      try {
        await firstValueFrom(
          this._http.assignRole({
            userId: Number(value.userId),
            roleId: Number(value.roleId),
            tenantId,
          })
        );
        this._dialogRef.close(REFRESH_DATA);
      } catch {
        /* snackbar handled by callers if needed */
      }
    });
  }
}
