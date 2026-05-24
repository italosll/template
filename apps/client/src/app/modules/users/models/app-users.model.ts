import { required } from "@angular/forms/signals";
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
            initialValue: 0,
          },
          {
            type: "text",
            name: "email",
            label: "email",
            initialValue: "",
            rules: [(path) => required(path.email)],
            width: 3,
          },
        ],
      },
    ]);
  }
}
