import { Injectable, signal } from "@angular/core";
import { COLOR_DETAILS } from "../components/app-settings-dialog/app-color-details.constant";
import { ColorPalettesEnum } from "../enums/color-palettes.enum";

export const DEFAULT_THEME_COLOR = ColorPalettesEnum.azure;
export const DEFAULT_THEME_BORDER_RADIUS_INTENSITY = 1;

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private _currentColor = signal<ColorPalettesEnum | null>(null);
  private _currentBorderRadiusIntensity = signal<number | null>(null);

  public readonly colorDetails = COLOR_DETAILS;

  public readonly availableColors = [
    ColorPalettesEnum.azure,
    ColorPalettesEnum.rose,
  ];

  public readonly currentColor = this._currentColor.asReadonly();
  public readonly currentBorderRadiusIntensity =
    this._currentBorderRadiusIntensity.asReadonly();

  constructor() {
    this.setColor(DEFAULT_THEME_COLOR);
    this.setBorderRadius(DEFAULT_THEME_BORDER_RADIUS_INTENSITY);
  }

  private _removeClassesFromBody(classNameSubstring: string) {
    const currentClasses = Array.from(document.body.classList);
    currentClasses.forEach((className) => {
      if (className.includes(classNameSubstring)) {
        document.body.classList.remove(className);
      }
    });
  }

  setColor(newColor: ColorPalettesEnum) {
    this._removeClassesFromBody("theme-color");
    document.body.classList.add(newColor);
    this._currentColor.set(newColor);
  }

  setBorderRadius(intensity: 0 | 1 | 2 | 3) {
    this._removeClassesFromBody("theme-radius");
    document.body.classList.add(`theme-radius-${intensity}`);
    this._currentBorderRadiusIntensity.set(intensity);
  }
}
