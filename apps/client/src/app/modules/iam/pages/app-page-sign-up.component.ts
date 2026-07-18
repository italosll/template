import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatStepperModule } from "@angular/material/stepper";
import { RouterLink } from "@angular/router";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { getIamRoutes } from "../app-index.routes";
import { TemplatePageSignComponent } from "../components/app-template-page-sign.component";
import { SignUpStepImageModel } from "../models/app-sign-up-step-image.model";
import { SignUpStepPersonLegalModel } from "../models/app-sign-up-step-person-legal.model";
import { SignUpStepUserModel } from "../models/app-sign-up-step-user.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonModule,
    MatCardModule,
    FormularyComponent,
    TemplatePageSignComponent,
    RouterLink,
    MatStepperModule,
    MatIconModule
],
  styles: [],
  template: `
    <app-template-page-sign>
      <mat-card>
        <mat-card-header>
          <mat-card-title> Crie sua conta </mat-card-title>
          <mat-card-subtitle>
            Ou,
            <a [routerLink]="'/' + routes.signIn.path">
              entre caso ja possua.</a
            >
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-vertical-stepper linear #stepper>
            <mat-step [completed]="formStepUser.form().valid()">
              <ng-template matStepLabel>Dados da conta</ng-template>
              <form
                id="sign-up-form-user"
                app-formulary
                [formModel]="formStepUser"
              ></form>
            </mat-step>
            <mat-step [completed]="formStepPersonLegal.form().valid()">
              <ng-template matStepLabel>Dados da empresa</ng-template>
              <form
                id="sign-up-form-person-legal"
                app-formulary
                [formModel]="formStepPersonLegal"
              ></form>
            </mat-step>
            <mat-step [completed]="formStepImage.form().valid()">
              <ng-template matStepLabel>Logo da empresa</ng-template>
              <form
                id="sign-up-form-image"
                app-formulary
                [formModel]="formStepImage"
              ></form>
            </mat-step>
          </mat-vertical-stepper>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            id="sign-up-form-button-previous"
            mat-button
            class="actionButton"
            (click)="stepper.previous()"
          >
            <mat-icon>north</mat-icon>

            Anterior
          </button>
          <button
            id="sign-up-form-button-next"
            class="actionButton"
            mat-fab
            extended
            color="primary"
            (click)="stepper.next()"
          >
            <mat-icon>south</mat-icon>
            Próximo
          </button>
        </mat-card-actions>
      </mat-card>
    </app-template-page-sign>
  `,
})
export class PageSignInComponent {
  protected formStepUser = new SignUpStepUserModel();
  protected formStepPersonLegal = new SignUpStepPersonLegalModel();
  protected formStepImage = new SignUpStepImageModel();

  protected routes = getIamRoutes().client;
}
