import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccessService } from "../services/app-access.service";
import { SignInContract } from "@interfaces/sign-in.contract";
import { MatCardModule } from "@angular/material/card";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { SignInModel } from "@client/iam/models/app-sign-in.model";
import { MatButtonModule } from "@angular/material/button";
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatButtonModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        MatCardModule,
        FormularyComponent
    ],
    styles: [
        `
            :host{
                display: block;
            }
            img{
                background-size: cover;
                width: 100%;
                height: 100%;
                position:relative;
            }
            mat-card{
                position: absolute !important;
                inset: 0;
                margin: auto;
                max-width: fit-content;
                max-height: fit-content;
            }
            mat-card-header{
                width: 400px;
                padding-bottom: 1rem !important;
            }
            mat-card-actions{
                padding: 1rem !important;
            }
        `
    ],
    template: `
    <img src="assets/wave-pattern-background.svg" />
    <mat-card>
        <mat-card-header>
            <mat-card-title>
                Entrar
            </mat-card-title>
        </mat-card-header>
        <mat-card-content>
            <form id="login-form" app-formulary [formGroup]="form" [schemes]="schemes" (ngSubmit)="onSubmit()"></form>
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
 `
})
export class SignInComponent {
    private _accessService = inject(AccessService);
    private _model = new SignInModel();
    protected schemes = this._model.schemes;
    protected form = this._model.form;

    protected onSubmit(){
        this._accessService.signIn(this.form.getRawValue() as SignInContract).subscribe();
    }
    
}

