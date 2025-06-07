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
            name: "phoneNumber",
            label: "phoneNumber",
            validators: [],
            width: 12,
          },
          {
            type: "text",
            name: "password",
            label: "password",
            validators: [],
            width: 12,
          },
        ],
      },
    ]);
  }
}
