import { FormGroup } from "@angular/forms";
import { FormularyUtils } from "@client/common/components/app-formulary/formulary.util";
import { SchemesContract } from "@client/common/components/app-formulary/scheme.contract";
import { FormControlsOf } from "../utils/app-form-controls-of.util";

export class FormModel<DTO> {
  private _schemes: SchemesContract<DTO>;
  private _form: FormGroup<FormControlsOf<DTO>>;

  constructor(schemes: SchemesContract<DTO>) {
    this._schemes = schemes.map((s) => ({ ...s, uniqueId: this._uniqueId() }));
    this._form = new FormularyUtils<DTO>().create(this._schemes);
  }

  private _uniqueId(): string {
    return `form-${Math.random().toString(36).substring(2, 15)}`;
  }

  public get schemes(): SchemesContract<DTO> {
    return this._schemes;
  }

  public get form(): FormGroup<FormControlsOf<DTO>> {
    return this._form;
  }
}
