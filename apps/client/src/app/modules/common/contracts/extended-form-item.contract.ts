import { Signal } from "@angular/core";
import { AbstractControl } from "@angular/forms";

export interface ExtendedFormItem extends AbstractControl {
  isVisible: Signal<boolean>;
  show(): void;
  hide(): void;
}
