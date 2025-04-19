import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { FormularyComponent } from "@client/common/components/app-formulary/app-formulary.component";
import { ProductModel } from "../models/app-product.model";
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
        <form app-formulary [formGroup]="form" [schemes]="schemes" (ngSubmit)="onSubmit()"></form>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button>Fechar</button>
            <button mat-button cdkFocusInitial>Salvar</button>
        </mat-dialog-actions>
    `
})
export class DialogProductComponent{
    private _model = new ProductModel();
    protected schemes = this._model.schemes;
    protected form = this._model.form;
    urlTest = "https://images.tcdn.com.br/img/img_prod/946807/kit_motor_de_portao_basculante_ppa_bv_home_jetflex_1_4_hp_com_acionamento_de_1_40m_2373_2_a6e94c0dda7439a8973f98028f42b9ad.jpg"

    constructor(){
    
        this.form.controls['image'].patchValue({
            base64image: null,
            url: this.urlTest,
            name: "teste.png"
        })

        this.form.controls['image'].valueChanges.subscribe((value) => {
         console.log("%%%%%-------")
            console.log(value);
        })
    }
 
    protected onSubmit(){
        console.log(this.form.getRawValue());
    }

}