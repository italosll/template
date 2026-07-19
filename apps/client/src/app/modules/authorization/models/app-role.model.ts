import { inject, signal } from "@angular/core";
import { required } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { RoleContract } from "@interfaces/role.contract";
import { PermissionsHttpService } from "../http/app-permissions.http.service";

export class RoleModel extends FormModel<RoleContract> {
  readonly ready = signal(false);

  constructor() {
    const permissionOptions: object[] = [];
    const permissionsHttp = inject(PermissionsHttpService);

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
              name: "name",
              label: "nome",
              initialValue: "",
              width: 6,
            },
            {
              type: "autocomplete-multi",
              name: "permissionIds",
              label: "permissoes",
              initialValue: [],
              width: 12,
              options: permissionOptions,
              valueKey: "id",
              descriptionKey: "code",
              placeholder: "Selecione permissoes",
            },
          ],
        },
      ],
      (path) => {
        required(path.name);
        required(path.permissionIds);
      }
    );

    permissionsHttp.findAll().subscribe((permissions) => {
      permissionOptions.push(
        ...permissions.map((permission) => ({
          id: permission.id,
          code: permission.description
            ? `${permission.code} — ${permission.description}`
            : permission.code,
        }))
      );
      this.ready.set(true);
    });
  }
}
