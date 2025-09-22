import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogSaveComponent } from "@client/common/components/app-dialog/app-dialog-save.component";
import { UserModel } from "@client/users/models/app-users.model";

@Component({
  selector: "app-page-users-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone:true,
  imports: [DialogSaveComponent],
  template: `<app-dialog-save [formModel]="formModel" title="Usuário" />`,
})
export class DialogUsersComponent {
  protected formModel = new UserModel();
}
