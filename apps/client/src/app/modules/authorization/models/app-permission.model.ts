import { required, pattern } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { PermissionContract } from "@interfaces/permission.contract";

export class PermissionModel extends FormModel<PermissionContract> {
  constructor() {
    super(
      [
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
              name: "code",
              label: "codigo",
              initialValue: "",
              width: 6,
            },
            {
              type: "text",
              name: "description",
              label: "descricao",
              initialValue: "",
              width: 6,
            },
          ],
        },
      ],
      (path) => {
        required(path.code);
        pattern(path.code, /^[a-z0-9]+(\.[a-z0-9]+)+$/);
      }
    );
  }
}
