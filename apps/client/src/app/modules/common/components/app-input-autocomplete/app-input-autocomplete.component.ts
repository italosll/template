import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  signal,
  untracked,
} from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import {
  MatFormFieldAppearance,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FileContract } from "@interfaces/file.contract";

type OptionRecord = Record<string, unknown>;

@Component({
  selector: "app-input-autocomplete",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      mat-form-field {
        width: 100%;
      }

      .option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .option-image {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 0.25rem;
        object-fit: cover;
        flex-shrink: 0;
      }
    `,
  ],
  template: `
    <mat-form-field [appearance]="appearance()">
      @if (label()) {
        <mat-label>{{ label() }}</mat-label>
      }
      <input
        type="text"
        matInput
        [matAutocomplete]="auto"
        [value]="filterText()"
        (input)="onFilterInput($event)"
        (blur)="onBlur()"
      />
      <mat-autocomplete
        #auto="matAutocomplete"
        (optionSelected)="onOptionSelected($event)"
      >
        @for (option of filteredOptions(); track optionValue(option)) {
          <mat-option [value]="option">
            <span class="option">
              @if (optionImageSrc(option); as imageSrc) {
                <img class="option-image" [src]="imageSrc" alt="" />
              }
              <span>{{ optionDescription(option) }}</span>
            </span>
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class InputAutocompleteComponent implements FormValueControl<unknown> {
  /** Selected option value (defaults to the option's `id`). */
  readonly value = model<unknown>("");

  readonly label = input<string>("");
  readonly options = input<object[]>([]);
  readonly valueKey = input<string>("id");
  readonly descriptionKey = input<string>("description");
  readonly imageKey = input<string | undefined>(undefined);
  readonly appearance = input<MatFormFieldAppearance>("outline");

  protected readonly filterText = signal("");

  protected readonly filteredOptions = computed(() => {
    const query = this.filterText().trim().toLowerCase();
    const descriptionKey = this.descriptionKey();
    const options = this.options();

    if (!query) {
      return options;
    }

    return options.filter((option) =>
      String(this.readKey(option, descriptionKey) ?? "")
        .toLowerCase()
        .includes(query),
    );
  });

  constructor() {
    effect(() => {
      const selectedValue = this.value();
      const match = this.options().find(
        (option) => this.optionValue(option) === selectedValue,
      );

      if (match) {
        untracked(() => this.filterText.set(this.optionDescription(match)));
      }
    });
  }

  protected optionValue(option: object): unknown {
    return this.readKey(option, this.valueKey());
  }

  protected optionDescription(option: object): string {
    return String(this.readKey(option, this.descriptionKey()) ?? "");
  }

  protected optionImageSrc(option: object): string | null {
    const key = this.imageKey();
    if (!key) {
      return null;
    }

    const image = this.readKey(option, key);
    if (!image) {
      return null;
    }

    if (typeof image === "string") {
      return image;
    }

    if (typeof image === "object") {
      const file = image as FileContract;
      return file.url || file.base64File || null;
    }

    return null;
  }

  protected onFilterInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.filterText.set(text);

    const selected = this.options().find(
      (option) => this.optionValue(option) === this.value(),
    );
    if (selected && this.optionDescription(selected) !== text) {
      this.value.set("");
    }
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as object;
    this.value.set(this.optionValue(option));
    this.filterText.set(this.optionDescription(option));
  }

  protected onBlur(): void {
    const selected = this.options().find(
      (option) => this.optionValue(option) === this.value(),
    );
    if (selected) {
      this.filterText.set(this.optionDescription(selected));
      return;
    }

    if (
      this.value() === "" ||
      this.value() === null ||
      this.value() === undefined
    ) {
      this.filterText.set("");
    }
  }

  private readKey(option: object, key: string): unknown {
    return (option as OptionRecord)[key];
  }
}
