import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormModel } from "@client/common/model/app-form.model";
import { FormularyInputsGroupComponent } from "./app-formulary-inputs-group.component";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "form[app-formulary]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormularyInputsGroupComponent, MatButtonModule, MatIconModule],
  styles: [
    `
      .array-section {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-block: 0.75rem;
      }

      .array-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .array-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
      }

      .array-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
        align-items: start;
        padding: 0.75rem;
        border: 1px solid var(--mat-sys-outline-variant, #c4c7c5);
        border-radius: 0.5rem;
      }

      .array-item app-formulary-inputs-group {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 1rem;
      }

      @media (min-width: 800px) {
        .array-item app-formulary-inputs-group {
          grid-template-columns: repeat(8, 1fr);
        }
      }

      @media (min-width: 1200px) {
        .array-item app-formulary-inputs-group {
          grid-template-columns: repeat(12, 1fr);
        }
      }
    `,
  ],
  template: `
    @for (scheme of formModel().schemes; track scheme?.uniqueId) {
      @if (scheme.type === "default") {
        <app-formulary-inputs-group
          [inputs]="scheme.inputs"
          [form]="formModel().form"
        />
      }

      @if (scheme.type === "array") {
        <section class="array-section">
          <div class="array-header">
            <h3 class="array-title">{{ scheme.label || scheme.name }}</h3>
            <button
              mat-stroked-button
              type="button"
              (click)="formModel().addArrayItem(scheme.name)"
            >
              <mat-icon>add</mat-icon>
              Adicionar
            </button>
          </div>

          @for (
            item of arrayField(scheme.name);
            track $index;
            let index = $index
          ) {
            <div class="array-item">
              <app-formulary-inputs-group
                [inputs]="scheme.inputs"
                [form]="item"
              />
              <button
                mat-icon-button
                type="button"
                aria-label="Remover item"
                (click)="formModel().removeArrayItem(scheme.name, index)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </section>
      }
    }
  `,
})
export class FormularyComponent<T = any> {
  public formModel = input.required<FormModel<T>>();

  protected arrayField(name: string) {
    return (this.formModel().form as Record<string, unknown>)[name] as Iterable<
      FormModel<T>["form"]
    >;
  }
}
