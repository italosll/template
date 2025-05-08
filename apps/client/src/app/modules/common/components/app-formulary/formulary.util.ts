import { FormArray, FormControl, FormGroup, FormRecord } from "@angular/forms";
import { SchemeContract, SchemeInputsContract } from "./scheme.contract";

export class FormularyUtils {

    private _registerInputs(inputs:SchemeInputsContract[], formRecord:FormRecord){

        inputs.forEach(input => {
       
            // if(input.type === "image"){
            //     formRecord.addControl(
            //         input.name,
            //          new FormGroup({
            //             base64image: new FormControl(null),
            //             url: new FormControl(null),
            //             name: new FormControl(null)
            //          }, input.validators, input.asyncValidators));
            //     return;
            // }

            formRecord.addControl( input.name, new FormControl(input.initialValue, input?.validators, input.asyncValidators));
       
       
        });

        return formRecord;
    }


    create( scheme:SchemeContract):FormRecord {
        const formRecord = new FormRecord({});

        scheme.forEach(element => {

            if(element.type === "default") {
                this._registerInputs(element.inputs, formRecord);
            }

            if(element.type === "group") {
                formRecord.addControl(element.name, this._registerInputs(element.inputs, new FormRecord({})));
            }

            if(element.type === "array") {
                formRecord.addControl(element.name, new FormArray([]));
            }
        });

        return formRecord;
    }
}