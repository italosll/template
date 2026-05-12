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
import { MatButtonModule } from "@angular/material/button";
import { RibbonItemDataToken } from "./app-ribbon-category-item.provider";
import { DialogOpenerUtil } from "@client/common/utils/app-dialog-opener.util";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: "app-ribbon-category-item",
  providers: [],
  styleUrls: ["./app-ribbon-category-item-delete.component.scss"],
  imports: [FormsModule, MatIconModule, MatSidenavModule, MatButtonModule],
  template: `
    @if (item) {
    <button
      matButton="filled"
      (click)="openDeleteDialog()"
    >
      <mat-icon>delete</mat-icon>
      <span>
        Deletar
      </span>
    </button>
    }
  `,
})
export class RibbonCategoryItemDeleteComponent {
  protected item = inject(RibbonItemDataToken);
  private _injector= inject(Injector);

  protected async openDeleteDialog():Promise<void> {
    await runInInjectionContext(this._injector,
      async ()=>await new DialogOpenerUtil().openDeleteDialog())
  }
}
