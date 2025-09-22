import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
  computed
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from "@angular/material/dialog";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { ActivatedRoute } from "@angular/router";
import { FormModel } from "@client/common/model/app-form.model";

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
    FormularyComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ title() }}</h2>
    <mat-dialog-content>
      <form
        id="form"
        app-formulary
        [formGroup]="form()"
        [schemes]="schemes()"
        (ngSubmit)="onSubmit()"
      ></form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Fechar</button>
      <button
        mat-flat-button
        cdkFocusInitial
        type="submit"
        form="form"
        color="primary"
        [disabled]="!form().valid"
      >
        Salvar
      </button>
    </mat-dialog-actions>
  `,
})
export class DialogSaveComponent<EntityType> {
  private readonly _http = inject(BaseHttpService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  protected id = JSON?.parse(
    this._activatedRoute?.snapshot.queryParams?.["editar"] ?? null
  )?.["id"];

  public title = input.required<string>();
  public formModel = input.required<FormModel<EntityType>>();
  public form = computed(()=>this.formModel().form);
  public schemes = computed(()=>this.formModel().schemes);

  protected onSubmit() {
    if (this.id) this._http.update(this.form().getRawValue()).subscribe();
    else this._http.create(this.form().getRawValue()).subscribe();
  }
}
