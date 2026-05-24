import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { FormField } from "@angular/forms/signals";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { InputImageComponent } from "../app-input-file/app-input-file.component";
import { SchemesContract } from "./scheme.contract";

@Component({
  selector: "app-formulary-inputs-group",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    FormField,
    MatInputModule,
    MatRadioModule,
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

      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .radio-title {
        font-size: 0.875rem;
        font-weight: 600;
      }
    `,
  ],
  template: `
    @for(input of inputs(); track input.name){ @if(input.type === "text"){
    <mat-form-field
      [style.grid-column]="'span ' + input.width"
    >
      <mat-label>{{ input.label }}</mat-label>
      <input [formField]="fieldFor(input.name)" matInput />
    </mat-form-field>

    } @if(input.type === "image"){
    <mat-form-field
      [style.grid-column]="'span ' + input.width"
      [style.grid-row]="'span ' + 2"
    >
      <mat-label style="background: white; padding: 5px;">{{
        input.label
      }}</mat-label>
      <app-input-file [formField]="fieldFor(input.name)" />
    </mat-form-field>

    } @if(input.type === "radio"){
    <div [style.grid-column]="'span ' + input.width">
      @if(input.title !== null && input.title !== undefined){
      <span class="radio-title">{{ input.title }}</span>
      }
      <mat-radio-group class="radio-group" [formField]="fieldFor(input.name)">
        @for(option of input.options; track option.value){
        <mat-radio-button [value]="option.value">
          {{ option.description }}
        </mat-radio-button>
        }
      </mat-radio-group>
    </div>

    } }
  `,
})
export class FormularyInputsGroupComponent {
  public inputs = input.required<SchemesContract[0]["inputs"]>();
  public form = input.required<unknown>();

  protected fieldFor(name: string): unknown {
    const formTree = this.form() as Record<string, unknown> | null;
    if (!formTree) return undefined;
    return formTree[name];
  }
}
