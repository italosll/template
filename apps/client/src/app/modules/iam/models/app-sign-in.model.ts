import { FormularyUtils } from "@client/common/components/app-formulary/formulary.util";
import { SchemeContract } from "@client/common/components/app-formulary/scheme.contract";
import { SignInContract } from "@interfaces/sign-in.contract";

export class SignInModel{


    public readonly schemes: SchemeContract<SignInContract> =
    [
        {
            type: "default",
            name: "email",
            inputs: [
                {
                    type: "text",
                    name: "email",
                    label: "email",
                    validators: [],
                    width: 12
                    
                },
                {
                    type: "text",
                    name: "password",
                    label: "password",
                    validators: [],
                    width: 12
                }
            ]
        }
    ];
    
    public readonly form = new FormularyUtils().create(this.schemes);
}