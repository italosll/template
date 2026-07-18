import {  PathKind, pattern, required, SchemaPath, SchemaPathTree } from "@angular/forms/signals";

export type DeepNonNullable<T> = T extends object
  ? { [K in keyof T]-?: DeepNonNullable<NonNullable<T[K]>> }
  : NonNullable<T>;

export type SignalRule<T>= typeof required | typeof pattern | ((path: SchemaPath<T, any>) => void);
export interface SchemeBaseInput<T> {
  name: keyof T & string;
  label?: string; // case the name must be different form the title the user sees.
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  initialValue?: unknown;
}

export interface SchemeId<T> {
  type: "id";
  name: keyof T & string;
  initialValue?: unknown;
  rules?:(value:SchemaPathTree<DeepNonNullable<T>, PathKind.Root>)=> void,
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

export type SchemeFormFieldAppearance = "fill" | "outline";

export interface SchemeAutoComplete<T> extends SchemeBaseInput<T> {
  type: "autocomplete";
  /** List of option objects to choose from. */
  options: object[];
  /**
   * Property used as the stored form value.
   * @default "id"
   */
  valueKey?: string;
  /**
   * Property used as the visible label in the input and panel.
   * @default "description"
   */
  descriptionKey?: string;
  /**
   * Optional property for an image (URL string or FileContract-like object).
   * When set, the panel shows a thumbnail next to each option.
   */
  imageKey?: string;
  /**
   * Material form-field appearance.
   * @default "outline"
   */
  appearance?: SchemeFormFieldAppearance;
}

export interface SchemeRadioOption {
  description: string;
  value: unknown;
}

export interface SchemeRadio<T> extends SchemeBaseInput<T> {
  type: "radio";
  title?: string | null;
  options: SchemeRadioOption[];
}

export type SchemeInputsContract<T = any> =
  | SchemeInput<T>
  | SchemeSelect<T>
  | SchemeAutoComplete<T>
  | SchemeRadio<T>
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
