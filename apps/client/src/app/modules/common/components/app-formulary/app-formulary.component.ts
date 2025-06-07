import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  FormGroup,
  FormRecord,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { FormularyInputsGroupComponent } from "./app-formulary-inputs-group.component";
import { SchemesContract } from "./scheme.contract";
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "form[app-formulary]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormularyInputsGroupComponent, FormsModule],
  template: `
    @for(scheme of schemes(); track scheme?.uniqueId){ @if(scheme.type ===
    "default"){
    <app-formulary-inputs-group
      [inputs]="scheme.inputs"
      [formGroup]="formGroup()"
    />
    } }
  `,
})
export class FormularyComponent {
  public schemes = input.required<SchemesContract>();
  public formGroup = input.required<FormGroup | FormRecord>();
}
