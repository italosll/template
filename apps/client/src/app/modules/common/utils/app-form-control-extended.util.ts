import { signal } from "@angular/core";
import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  ValidatorFn,
} from "@angular/forms";
import { ExtendedFormItem } from "../contracts/extended-form-item.contract";

export class FormControlExtended<T = null>
  extends FormControl<T | null>
  implements ExtendedFormItem
{
  private readonly _isVisible = signal(true);
  public readonly isVisible = this._isVisible.asReadonly();

  constructor(
    formState: T,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  show() {
    this._isVisible.set(true);
  }

  hide() {
    this._isVisible.set(false);
  }
}
