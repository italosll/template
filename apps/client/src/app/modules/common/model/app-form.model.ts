import { EffectRef, Signal, WritableSignal, effect, signal } from "@angular/core";
import { FieldTree, form, PathKind, SchemaPathTree } from "@angular/forms/signals";
import {
  DeepNonNullable,
  SchemeInputsContract,
  SchemesContract,
  SignalRule,
} from "@client/common/components/app-formulary/scheme.contract";



export class FormModel<DTO> {
  private readonly _schemes: SchemesContract<DTO>;
  private readonly _defaults: DTO;
  private readonly _model: WritableSignal<DeepNonNullable<DTO>>;
  public readonly form: FieldTree<DeepNonNullable<DTO>, string | number>
  public readonly value: Signal<DeepNonNullable<DTO>>;

  constructor(
    schemes: SchemesContract<DTO>,
    rules?:(value:SchemaPathTree<DeepNonNullable<DTO>, PathKind.Root>)=> void,
    effects?:((form:FieldTree<DeepNonNullable<DTO>, string | number>) => EffectRef)[]
  ) {
    this._schemes = schemes.map((s) => ({ ...s, uniqueId: this._uniqueId() }));
    this._defaults = this._buildDefaults(this._schemes) as DTO;
    this._model = signal<DeepNonNullable<DTO>>(this._defaults as DeepNonNullable<DTO>);
    this.form = form(this._model, (schemaPath) => {
        rules?.(schemaPath);
    });
    this.value = this._model.asReadonly();

    if(effects?.length) {
      effects.forEach((effectFn) => {
        effectFn(this.form);
      });
    }
  }

  private _uniqueId(): string {
    return `form-${Math.random().toString(36).substring(2, 15)}`;
  }

  public get schemes(): SchemesContract<DTO> {
    return this._schemes;
  }

  public patchValue(value: Partial<DTO>) {
    this._model.set(this._mergeDefaults(this._defaults, value) as DeepNonNullable<DTO>);
  }

  private _buildDefaults(schemes: SchemesContract<DTO>): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};

    schemes.forEach((scheme) => {
      if (scheme.type === "default") {
        this._assignInputDefaults(defaults, scheme.inputs);
      }

      if (scheme.type === "group") {
        defaults[scheme.name] = this._buildInputsDefaults(scheme.inputs);
      }

      if (scheme.type === "array") {
        defaults[scheme.name] = [];
      }
    });

    return defaults;
  }

  private _buildInputsDefaults(inputs: SchemeInputsContract<DTO>[]): Record<string, unknown> {
    const values: Record<string, unknown> = {};

    inputs.forEach((input) => {
      values[input.name] = this._resolveInitialValue(input);
    });

    return values;
  }

  private _assignInputDefaults(
    target: Record<string, unknown>,
    inputs: SchemeInputsContract<DTO>[]
  ) {
    inputs.forEach((input) => {
      target[input.name] = this._resolveInitialValue(input);
    });
  }

  private _resolveInitialValue(input: SchemeInputsContract<DTO>): unknown {
    if (input.initialValue !== undefined && input.initialValue !== null) {
      return input.initialValue;
    }

    if (input.type === "id") {
      return 0;
    }

    if (input.type === "image") {
      return { base64File: "", url: "", name: "" };
    }

    if (input.type === "radio") {
      const firstOption = input.options?.[0];
      if (firstOption && firstOption.value !== null && firstOption.value !== undefined) {
        return firstOption.value;
      }
    }

    if (input.type === "select" || input.type === "autocomplete") {
      const firstOption = input.options?.[0];
      if (firstOption && input.optionsValue) {
        const optionValue = (firstOption as Record<string, unknown>)[
          input.optionsValue
        ];
        if (optionValue !== null && optionValue !== undefined) {
          return optionValue;
        }
      }
    }

    return "";
  }


  private _mergeDefaults(
    defaults: unknown,
    patch: unknown
  ): unknown {
    if (patch === null || patch === undefined) {
      return defaults;
    }

    if (Array.isArray(defaults)) {
      return Array.isArray(patch) ? patch : defaults;
    }

    if (this._isPlainObject(defaults)) {
      const defaultRecord = defaults as Record<string, unknown>;
      const patchRecord = this._isPlainObject(patch)
        ? (patch as Record<string, unknown>)
        : {};
      const merged: Record<string, unknown> = { ...defaultRecord };

      Object.keys(defaultRecord).forEach((key) => {
        merged[key] = this._mergeDefaults(defaultRecord[key], patchRecord[key]);
      });

      return merged;
    }

    return patch;
  }

  private _isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

 
}
