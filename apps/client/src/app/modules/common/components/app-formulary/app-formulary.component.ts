import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormularyInputsGroupComponent } from "./app-formulary-inputs-group.component";
import { SchemesContract } from "./scheme.contract";
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
export class FormularyComponent {
  public schemes = input.required<SchemesContract>();
  public form = input.required<unknown>();
}
