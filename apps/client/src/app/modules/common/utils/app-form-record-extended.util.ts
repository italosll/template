import { signal } from "@angular/core";
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormRecord,
  ValidatorFn,
} from "@angular/forms";
import { ExtendedFormItem } from "../contracts/extended-form-item.contract";

export class FormRecordExtended<T extends AbstractControl>
  extends FormRecord<T>
  implements ExtendedFormItem
{
  private readonly _isVisible = signal(true);
  public readonly isVisible = this._isVisible.asReadonly();

  constructor(
    formState: {
      [key: string]: T;
    },
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

  setVisibility(visible: boolean) {
    this._isVisible.set(visible);
  }
}
