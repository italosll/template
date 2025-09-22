import { Validators } from "@angular/forms";
import { FormModel } from "@client/common/model/app-form.model";
import { UserContract } from "@interfaces/user.contract";

export class UserModel extends FormModel<UserContract> {
  constructor() {
    super([
      {
        type: "default",
        inputs: [
          {
            type: "id",
            name: "id",
          },
          {
            type: "text",
            name: "email",
            label: "email",
            validators: [Validators.required],
            width: 3,
          },
        ],
      },
    ]);
  }
}
