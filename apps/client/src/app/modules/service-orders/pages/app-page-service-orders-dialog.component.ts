import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogSaveComponent } from "@client/common/components/app-dialog/app-dialog-save.component";
import { ServiceOrderModel } from "../models/app-service-order.model";

@Component({
  selector: "app-page-service-orders-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogSaveComponent],
  template: `<app-dialog-save [formModel]="formModel" title="Ordem de Servico" />`,
})
export class DialogServiceOrderComponent {
  protected formModel = new ServiceOrderModel();
}
