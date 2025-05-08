import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { ProductModel } from "../models/app-product.model";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { ActivatedRoute } from "@angular/router";
@Component({
    selector: "app-page-products-dialog",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone:true,
    imports:[
        MatDialogModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        FormularyComponent,
        ReactiveFormsModule,
        FormsModule
    ],
    template:`
        <h2 mat-dialog-title>Product</h2>
        <mat-dialog-content>
        <form id="form" app-formulary [formGroup]="form" [schemes]="schemes" (ngSubmit)="onSubmit()"></form>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button mat-dialog-close >Fechar</button>
            <button 
                mat-button 
                cdkFocusInitial 
                type="submit" 
                form="form"
                [disabled]="!form.valid"
            >Salvar</button>
        </mat-dialog-actions>
    `
})
export class DialogProductComponent{
    private readonly _http = inject(BaseHttpService);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private _model = new ProductModel();
    protected schemes = this._model.schemes;
    protected form = this._model.form;
    protected id = JSON?.parse(this._activatedRoute?.snapshot.queryParams?.['editar'] ?? null)?.['id'];
    protected initialData$ = this._http.findById(this.id);
    
    constructor(){
        this.initialData$.subscribe((data) => {
            console.log(data)
            this.form.patchValue(data);
        })
    }
 
    protected onSubmit(){
        console.log(this.form.getRawValue());
        if(this.id) this._http.update(this.form.getRawValue()).subscribe();
        else this._http.create(this.form.getRawValue()).subscribe();
    }

}