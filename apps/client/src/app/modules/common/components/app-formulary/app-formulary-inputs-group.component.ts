import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { InputImageComponent } from "../app-input-file/app-input-file.component";
import { SchemesContract } from "./scheme.contract";

@Component({
  selector: "app-formulary-inputs-group",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    InputImageComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
  ],
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 1rem;
      }

      @media (min-width: 800px) {
        :host {
          grid-template-columns: repeat(8, 1fr);
        }
      }

      @media (min-width: 1200px) {
        :host {
          grid-template-columns: repeat(12, 1fr);
        }
      }
    `,
  ],
  template: `
    @for(input of inputs(); track input.name){ @if(input.type === "text"){
    <mat-form-field
      [style.grid-column]="'span ' + input.width"
      [formGroup]="form!"
    >
      <mat-label>{{ input.label }}</mat-label>
      <input [formControlName]="input.name" matInput />
    </mat-form-field>

    } @if(input.type === "image"){
    <mat-form-field
      [style.grid-column]="'span ' + input.width"
      [style.grid-row]="'span ' + 2"
      [formGroup]="form!"
    >
      <mat-label style="background: white; padding: 5px;">{{
        input.label
      }}</mat-label>
      <app-input-file [formControlName]="input.name" matInput />
    </mat-form-field>

    } }
  `,
})
export class FormularyInputsGroupComponent {
  public inputs = input.required<SchemesContract[0]["inputs"]>();
  private _formGroupDirective = inject(FormGroupDirective, {
    skipSelf: true,
    optional: true,
  });
  protected form = this._formGroupDirective?.form;
}
