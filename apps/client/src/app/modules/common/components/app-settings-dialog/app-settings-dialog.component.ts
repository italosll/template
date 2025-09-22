import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { MatSliderModule } from "@angular/material/slider";
import { ThemeService } from "@client/common/services/app-theme.service";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatButtonModule,
    MatChipsModule,
    FormsModule,
    MatSliderModule,
  ],
  template: `
    <h2 mat-dialog-title>Configurações</h2>

    <mat-dialog-content>
      <h4>Cor</h4>

      <mat-chip-listbox aria-label="Cutest dog breeds">
        @for (color of theme.availableColors; track color) {
        <mat-chip-option
          [selected]="color === theme.currentColor()"
          (selectionChange)="theme.setColor(color)"
          [style.background]="theme.colorDetails[color]?.hexadecimalColorCode"
          >{{ theme.colorDetails[color]?.description }}</mat-chip-option
        >
        }
      </mat-chip-listbox>

      <h4>Arredondamento das bordas</h4>

      <mat-slider
        [max]="3"
        [min]="0"
        [step]="1"
        [discrete]="false"
        [showTickMarks]="true"
      >
        <input
          matSliderThumb
          #slider
          [value]="theme.currentBorderRadiusIntensity()"
          (change)="setBorderRadius($event)"
        />
      </mat-slider>

      <div class="bg-red-500 w-10 h-10"></div>
    </mat-dialog-content>
  `,
})
export class SettingsDialogComponent {
  protected theme = inject(ThemeService);

  protected setBorderRadius(event: Event) {
    const value = Number((event.target as HTMLInputElement).value) as
      | 0
      | 1
      | 2
      | 3;

    this.theme.setBorderRadius(value);
  }
}
