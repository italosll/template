import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
  computed,
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
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { ActivatedRoute } from "@angular/router";
import { FormModel } from "@client/common/model/app-form.model";
import { firstValueFrom } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
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
        [form]="form()"
        [schemes]="schemes()"
        (submit)="onSubmit($event)"
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
        [disabled]="form().invalid() || form().pending()"
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
     this.formModel().patchValue(r)
   });
  }

  protected onSubmit(event: Event) {
    event.preventDefault();

    submit(this.form(), async () => {
      const payload = this.formModel().value();

      try {
        if (this.id) {
          await firstValueFrom(this._http.update(payload));
        } else {
          await firstValueFrom(this._http.create(payload));
        }
        this._matDialogRef.close(REFRESH_DATA);
      } catch {
        // Errors are handled by the caller and global interceptors.
      }
    });
  }
}
