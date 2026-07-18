import { FormModel } from "@client/common/model/app-form.model";
import { UserContract } from "@interfaces/user.contract";

export class SignUpStepUserModel extends FormModel<UserContract> {
  constructor() {
    super([
      {
        type: "default",
        inputs: [
          {
            type: "text",
            name: "email",
            label: "email",
            initialValue: "",
            width: 12,
          },
          {
            type: "text",
            name: "phoneNumber",
            label: "phoneNumber",
            initialValue: "",
            width: 12,
          },
          {
            type: "text",
            name: "password",
            label: "password",
            initialValue: "",
            width: 12,
          },
        ],
      },
    ]);
  }
}
