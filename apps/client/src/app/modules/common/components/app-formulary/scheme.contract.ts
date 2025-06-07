import {
  AsyncValidatorFn,
  FormControlOptions,
  ValidatorFn,
} from "@angular/forms";

export interface SchemeBaseInput<T> {
  name: keyof T & string;
  label?: string; // case the name must be different form the title the user sees.
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  validators?: ValidatorFn | ValidatorFn[] | FormControlOptions | null;
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
  initialValue?: unknown;
}

export interface SchemeId<T> {
  type: "id";
  name: keyof T & string;
  initialValue?: unknown;
  validators?: ValidatorFn | ValidatorFn[] | FormControlOptions | null;
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
}

export interface SchemeInput<T> extends SchemeBaseInput<T> {
  type: "text" | "image";
}

export interface SchemeSelect<T> extends SchemeBaseInput<T> {
  type: "select";
  options: object[];
  optionsKey?: string;
  optionsValue?: string;
}

export interface SchemeAutoComplete<T> extends SchemeBaseInput<T> {
  type: "autocomplete";
  options: object[];
  optionsKey?: string;
  optionsValue?: string;
}

export type SchemeInputsContract<T = any> =
  | SchemeInput<T>
  | SchemeSelect<T>
  | SchemeAutoComplete<T>
  | SchemeId<T>;

interface SchemeContract<T> {
  inputs: SchemeInputsContract<T>[];
  visible?: boolean;
}

export interface SchemeDefaultContract<T> extends SchemeContract<T> {
  type: "default";
  uniqueId?: string;
}

export interface SchemeFormGroupContract<T> extends SchemeContract<T> {
  type: "group";
  name: string;
  uniqueId?: string;
}

export interface SchemeArrayContract<T> extends SchemeContract<T> {
  type: "array";
  name: string;
  uniqueId?: string;
}

export type SchemesContract<T = any> = (
  | SchemeDefaultContract<T>
  | SchemeArrayContract<T>
  | SchemeFormGroupContract<T>
)[];
