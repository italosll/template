import { Signal, WritableSignal, signal } from "@angular/core";
import { form } from "@angular/forms/signals";
import {
  SchemeInputsContract,
  SchemesContract,
  SignalRule,
} from "@client/common/components/app-formulary/scheme.contract";

export class FormModel<DTO> {
  private readonly _schemes: SchemesContract<DTO>;
  private readonly _defaults: DTO;
  private readonly _model: WritableSignal<DTO>;
  public readonly form: ReturnType<typeof form>;
  public readonly value: Signal<DTO>;

  constructor(schemes: SchemesContract<DTO>) {
    this._schemes = schemes.map((s) => ({ ...s, uniqueId: this._uniqueId() }));
    this._defaults = this._buildDefaults(this._schemes) as DTO;
    this._model = signal<DTO>(this._defaults);
    this.form = form(this._model, (schemaPath) => {
      this._applyRules(schemaPath);
    });
    this.value = this._model.asReadonly();
  }

  private _uniqueId(): string {
    return `form-${Math.random().toString(36).substring(2, 15)}`;
  }

  public get schemes(): SchemesContract<DTO> {
    return this._schemes;
  }

  public patchValue(value: Partial<DTO>) {
    this._model.set(this._mergeDefaults(this._defaults, value) as DTO);
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

  private _buildInputsDefaults(inputs: SchemeInputsContract[]): Record<string, unknown> {
    const values: Record<string, unknown> = {};

    inputs.forEach((input) => {
      values[input.name] = this._resolveInitialValue(input);
    });

    return values;
  }

  private _assignInputDefaults(
    target: Record<string, unknown>,
    inputs: SchemeInputsContract[]
  ) {
    inputs.forEach((input) => {
      target[input.name] = this._resolveInitialValue(input);
    });
  }

  private _resolveInitialValue(input: SchemeInputsContract): unknown {
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

  private _applyRules(schemaPath: unknown) {
    const rootPath = schemaPath as Record<string, unknown>;

    this._schemes.forEach((scheme) => {
      if (scheme.type === "default") {
        this._applyInputRules(rootPath, scheme.inputs);
      }

      if (scheme.type === "group") {
        const groupPath = rootPath[scheme.name] as Record<string, unknown>;
        if (groupPath) {
          this._applyInputRules(groupPath, scheme.inputs);
        }
      }
    });
  }

  private _applyInputRules(
    path: Record<string, unknown>,
    inputs: SchemeInputsContract[]
  ) {
    inputs.forEach((input) => {
      const field = path[input.name];
      const rules = input.rules ?? [];
      rules.forEach((rule: SignalRule) => rule(field));
    });
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
