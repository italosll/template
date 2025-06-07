import { FormArray, FormRecord } from "@angular/forms";
import { FormControlExtended } from "@client/common/utils/app-form-control-extended.util";
import { FormControlsOf } from "@client/common/utils/app-form-controls-of.util";
import { FormGroupExtended } from "@client/common/utils/app-form-group-extended.util";
import { FormRecordExtended } from "@client/common/utils/app-form-record-extended.util";
import { SchemeInputsContract, SchemesContract } from "./scheme.contract";

export class FormularyUtils<DTO> {
  private _registerInputs(
    inputs: SchemeInputsContract[],
    formRecord: FormRecord
  ) {
    inputs.forEach((input) => {
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

      formRecord.addControl(
        input.name,
        new FormControlExtended(
          input.initialValue,
          input?.validators,
          input.asyncValidators
        )
      );
    });

    return formRecord;
  }

  create(
    schemes: SchemesContract<DTO>
  ): FormGroupExtended<FormControlsOf<DTO>> {
    const formRecord = new FormRecordExtended({});

    schemes.forEach((element) => {
      if (element.type === "default") {
        this._registerInputs(element.inputs, formRecord);
      }

      if (element.type === "group") {
        formRecord.addControl(
          element.name,
          this._registerInputs(element.inputs, new FormRecordExtended({}))
        );
      }

      if (element.type === "array") {
        formRecord.addControl(element.name, new FormArray([]));
      }
    });

    return formRecord as unknown as FormGroupExtended<FormControlsOf<DTO>>;
  }
}
