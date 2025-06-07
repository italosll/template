import { FormModel } from "@client/common/model/app-form.model";
import { TenantContract } from "@interfaces/tenant.contract";

export class SignUpStepImageModel extends FormModel<TenantContract> {
  constructor() {
    super([
      {
        type: "default",
        inputs: [
          {
            type: "image",
            name: "image",
            width: 12,
          },
        ],
      },
    ]);
  }
}
