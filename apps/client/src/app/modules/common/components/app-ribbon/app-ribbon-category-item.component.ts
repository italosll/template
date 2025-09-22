import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { RibbonItemContract } from "../../contracts/ribbon.contract";

import { MatButtonModule } from "@angular/material/button";

import { RibbonItemDataToken } from "./app-ribbon-category-item.provider";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: "app-ribbon-category-item",
  providers: [],
  imports: [FormsModule, MatIconModule, MatSidenavModule, MatButtonModule],
  styles: [``],
  template: `
    @if (item) {
    <button
      matButton="filled"
      (click)="runFunctionInInjectionContext(item.click)"
    >
      <mat-icon>{{ item.icon }}</mat-icon>
      <span>
        {{ item.title }}
      </span>
    </button>
    }
  `,
})
export class RibbonCategoryItemComponent {
  private _injector = inject(Injector);
  protected item = inject(RibbonItemDataToken);

  protected runFunctionInInjectionContext(
    functionClick: RibbonItemContract["click"]
  ) {
    runInInjectionContext(this._injector, async () => {
      if (functionClick) await functionClick();
    });
  }
}
