import { Validators } from "@angular/forms";
import { FormularyUtils } from "@client/common/components/app-formulary/formulary.util";
import { SchemeContract } from "@client/common/components/app-formulary/scheme.contract";
import { ProductContract } from "@interfaces/product.contract";
import { min } from "rxjs";

export class ProductModel{
    public readonly schemes: SchemeContract<ProductContract> =
    [
        {
            type: "default",
            name: "email",
            inputs: [
                {
                    type: "id",
                    name: "id",
                },
                {
                    type: "image",
                    name: "image",
                    label: "imagem",
                    validators: [],
                    width: 3
                },
                {
                    type: "text",
                    name: "code",
                    label: "codigo",
                    validators: [Validators.required],
                    width: 3
                },
                {
                    type: "text",
                    name: "description",
                    label: "descricao",
                    validators: [],
                    width: 3
                },
                {
                    type: "text",
                    name: "name",
                    label: "nome",
                    validators: [Validators.required],
                    width: 3
                }
            ]
        }
    ];
    
    public readonly form = new FormularyUtils().create(this.schemes);
}