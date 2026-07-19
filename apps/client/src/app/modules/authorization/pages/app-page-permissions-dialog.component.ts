import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogSaveComponent } from "@client/common/components/app-dialog/app-dialog-save.component";
import { PermissionModel } from "../models/app-permission.model";

@Component({
  selector: "app-page-permissions-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogSaveComponent],
  template: `<app-dialog-save [formModel]="formModel" title="Permissao" />`,
})
export class DialogPermissionComponent {
  protected formModel = new PermissionModel();
}
