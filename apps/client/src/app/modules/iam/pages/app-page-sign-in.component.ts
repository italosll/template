
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { submit } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { SignInContract } from "@interfaces/sign-in.contract";
import { getIamRoutes } from "../app-index.routes";
import { TemplatePageSignComponent } from "../components/app-template-page-sign.component";
import { SignInModel } from "../models/app-sign-in.model";
import { AccessService } from "../services/app-access.service";
import { firstValueFrom } from "rxjs";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    MatCardModule,
    FormularyComponent,
    TemplatePageSignComponent,
    RouterLink
],
  styles: [],
  template: `
    <app-template-page-sign>
      <mat-card>
        <mat-card-header>
          <mat-card-title> Entre </mat-card-title>
          <mat-card-subtitle>
            Ou,
            <a [routerLink]="'/' + routes.signUp.path"> Crie sua conta</a>
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form
            id="login-form"
            app-formulary
            [form]="form"
            [schemes]="schemes"
            (submit)="onSubmit($event)"
          ></form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            mat-flat-button
            color="primary"
            type="submit"
            form="login-form"
            [disabled]="form().invalid() || form().pending()"
          >
            Entrar
          </button>
        </mat-card-actions>
      </mat-card>
    </app-template-page-sign>
  `,
})
export class PageSignInComponent {
  private _accessService = inject(AccessService);
  private _model = new SignInModel();
  protected schemes = this._model.schemes;
  protected form = this._model.form;
  protected routes = getIamRoutes().client;

  protected onSubmit(event: Event) {
    event.preventDefault();
    submit(this.form, async () => {
      await firstValueFrom(
        this._accessService.signIn(this._model.value() as SignInContract)
      );
    });
  }

  constructor() {}
}
