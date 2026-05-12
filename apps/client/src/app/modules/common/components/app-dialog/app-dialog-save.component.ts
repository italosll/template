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
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule, MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { ActivatedRoute } from "@angular/router";
import { FormModel } from "@client/common/model/app-form.model";
import { firstValueFrom } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DialogRef } from "@angular/cdk/dialog";
import { REFRESH_DATA } from "@client/common/constants/refresh-data.constant";

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
    MatProgressSpinnerModule
  ],
  styles:`

    .loading{
      @apply opacity-30 pointer-events-none select-none
    }
  `,

  template: `

    @if(loading()){
      <mat-spinner style="position: absolute" class="z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></mat-spinner>
    }
    <h2 mat-dialog-title>{{ title() }}</h2>
    <mat-dialog-content
    [class]="loading() ? 'loading' : '' "
    >
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

  private readonly _matDialogRef = inject(MatDialogRef);
  private readonly _dialogRef = inject(DialogRef);
  protected loading = this._http.loadingFind;
  protected id = JSON?.parse(
    this._activatedRoute?.snapshot.queryParams?.["editar"] ?? null
  )?.["id"];

  public title = input.required<string>();
  public formModel = input.required<FormModel<EntityType>>();
  public form = computed(()=>this.formModel().form);
  public schemes = computed(()=>this.formModel().schemes);


  constructor (){
    this._http.findById(this.id).subscribe((r)=>{
     this.form().patchValue(r)
   });
  }

  protected onSubmit() {
    if (this.id) this._http.update(this.form().getRawValue()).subscribe().add(()=>this._matDialogRef.close(REFRESH_DATA));
    else this._http.create(this.form().getRawValue()).subscribe().add(()=>this._matDialogRef.close(REFRESH_DATA));
  }
}
