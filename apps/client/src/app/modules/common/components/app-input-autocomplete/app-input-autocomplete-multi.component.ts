import { LiveAnnouncer } from "@angular/cdk/a11y";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import {
  MatChipInputEvent,
  MatChipsModule,
} from "@angular/material/chips";
import {
  MatFormFieldAppearance,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FileContract } from "@interfaces/file.contract";

type OptionRecord = Record<string, unknown>;

@Component({
  selector: "app-input-autocomplete-multi",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  // MatAutocompleteModule must be imported before MatChipsModule so keyboard
  // selection does not also create a free-form chip from the typed text.
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
  ],
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
      <mat-chip-grid #chipGrid [attr.aria-label]="label() || 'Selection'">
        @for (option of selectedOptions(); track optionValue(option)) {
          <mat-chip-row (removed)="remove(option)">
            {{ optionDescription(option) }}
            <button
              matChipRemove
              [attr.aria-label]="'remove ' + optionDescription(option)"
            >
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
      </mat-chip-grid>
      <input
        #filterInput
        type="text"
        [placeholder]="placeholder()"
        [matChipInputFor]="chipGrid"
        [matAutocomplete]="auto"
        [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
        [value]="filterText()"
        (input)="onFilterInput($event)"
        (matChipInputTokenEnd)="addFromInput($event)"
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
export class InputAutocompleteMultiComponent
  implements FormValueControl<unknown[]>
{
  /** Selected option values (defaults to each option's `id`). */
  readonly value = model<unknown[]>([]);

  readonly label = input<string>("");
  readonly placeholder = input<string>("");
  readonly options = input<object[]>([]);
  readonly valueKey = input<string>("id");
  readonly descriptionKey = input<string>("description");
  readonly imageKey = input<string | undefined>(undefined);
  readonly appearance = input<MatFormFieldAppearance>("outline");

  protected readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  protected readonly filterText = signal("");

  private readonly filterInput =
    viewChild<ElementRef<HTMLInputElement>>("filterInput");
  private readonly announcer = inject(LiveAnnouncer);

  protected readonly selectedOptions = computed(() => {
    const selected = new Set(this.value());
    return this.options().filter((option) =>
      selected.has(this.optionValue(option)),
    );
  });

  protected readonly filteredOptions = computed(() => {
    const query = this.filterText().trim().toLowerCase();
    const descriptionKey = this.descriptionKey();
    const selected = new Set(this.value());

    return this.options().filter((option) => {
      if (selected.has(this.optionValue(option))) {
        return false;
      }

      if (!query) {
        return true;
      }

      return String(this.readKey(option, descriptionKey) ?? "")
        .toLowerCase()
        .includes(query);
    });
  });

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
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  protected addFromInput(event: MatChipInputEvent): void {
    const text = (event.value || "").trim();
    if (!text) {
      this.clearFilter();
      return;
    }

    const match = this.filteredOptions().find(
      (option) =>
        this.optionDescription(option).toLowerCase() === text.toLowerCase(),
    );

    if (match) {
      this.selectOption(match);
    } else {
      this.clearFilter();
    }
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as object;
    this.selectOption(option);
    event.option.deselect();
  }

  protected remove(option: object): void {
    const optionValue = this.optionValue(option);
    this.value.update((current) =>
      current.filter((item) => item !== optionValue),
    );
    void this.announcer.announce(`Removed ${this.optionDescription(option)}`);
  }

  private selectOption(option: object): void {
    const optionValue = this.optionValue(option);
    if (this.value().includes(optionValue)) {
      this.clearFilter();
      return;
    }

    this.value.update((current) => [...current, optionValue]);
    this.clearFilter();
  }

  private clearFilter(): void {
    this.filterText.set("");
    const inputEl = this.filterInput()?.nativeElement;
    if (inputEl) {
      inputEl.value = "";
    }
  }

  private readKey(option: object, key: string): unknown {
    return (option as OptionRecord)[key];
  }
}
