import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { SignInContract } from "@interfaces/sign-in.contract";
import { getIamRoutes } from "../app-index.routes";
import { TemplatePageSignComponent } from "../components/app-template-page-sign.component";
import { SignInModel } from "../models/app-sign-in.model";
import { AccessService } from "../services/app-access.service";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    FormularyComponent,
    TemplatePageSignComponent,
    RouterLink,
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
            [formGroup]="form"
            [schemes]="schemes"
            (ngSubmit)="onSubmit()"
          ></form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            mat-flat-button
            color="primary"
            type="submit"
            form="login-form"
            [disabled]="!form.valid"
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

  protected onSubmit() {
    this._accessService
      .signIn(this.form.getRawValue() as SignInContract)
      .subscribe();
  }

  constructor() {}
}
