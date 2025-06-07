import { FormArray, FormControl, FormGroup } from "@angular/forms";

type Primitive = string | number | boolean | Date | null | undefined;

// Base mapped type: convert each property to FormControl
export type FormControlsOf<T> = {
  [K in keyof T]: T[K] extends Primitive
    ? FormControl<T[K]>
    : T[K] extends Array<infer U>
    ? FormArray<FormControl<U>>
    : FormGroup<FormControlsOf<T[K]>>;
};
