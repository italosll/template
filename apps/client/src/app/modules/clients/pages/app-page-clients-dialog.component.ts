import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogSaveComponent } from "@client/common/components/app-dialog/app-dialog-save.component";
import { ClientModel } from "../models/app-client.model";

@Component({
  selector: "app-page-clients-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogSaveComponent],
  template: `<app-dialog-save [formModel]="formModel" title="Cliente" />`,
})
export class DialogClientComponent {
  protected formModel = new ClientModel();
}
