import { FormModel } from "@client/common/model/app-form.model";
import { SignInContract } from "@interfaces/sign-in.contract";

export class SignInModel extends FormModel<SignInContract> {
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
