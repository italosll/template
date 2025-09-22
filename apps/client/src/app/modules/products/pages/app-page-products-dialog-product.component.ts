import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogSaveComponent } from "@client/common/components/app-dialog/app-dialog-save.component";
import { ProductModel } from "../models/app-product.model";

@Component({
  selector: "app-page-products-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DialogSaveComponent],
  template: `<app-dialog-save [formModel]="formModel" title="Produto" />`,
})
export class DialogProductComponent {
  protected formModel = new ProductModel();
}
