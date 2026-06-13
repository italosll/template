import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormularyInputsGroupComponent } from "./app-formulary-inputs-group.component";
import { DeepNonNullable, SchemesContract } from "./scheme.contract";
import { FieldTree } from "@angular/forms/signals";
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "form[app-formulary]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormularyInputsGroupComponent],
  template: `
    @for(scheme of schemes(); track scheme?.uniqueId){ @if(scheme.type ===
    "default"){
    <app-formulary-inputs-group
      [inputs]="scheme.inputs"
      [form]="form()"
    />
    } }
  `,
})
export class FormularyComponent<T = any> {
  public schemes = input.required<SchemesContract<T>>();
  public form = input.required<FieldTree<DeepNonNullable<T>, string | number>>();
}
