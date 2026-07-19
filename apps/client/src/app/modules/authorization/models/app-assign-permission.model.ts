import { inject, signal } from "@angular/core";
import { required } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { AssignPermissionContract } from "@interfaces/assign-permission.contract";
import { forkJoin } from "rxjs";
import { UsersHttpService } from "@client/users/http/app-users.http.service";
import { PermissionsHttpService } from "../http/app-permissions.http.service";

export type AssignPermissionFormValue = AssignPermissionContract & {
  scope?: "tenant" | "global";
};

export class AssignPermissionModel extends FormModel<AssignPermissionFormValue> {
  readonly ready = signal(false);

  constructor() {
    const userOptions: object[] = [];
    const permissionOptions: object[] = [];
    const usersHttp = inject(UsersHttpService);
    const permissionsHttp = inject(PermissionsHttpService);

    super(
      [
        {
          type: "default",
          inputs: [
            {
              type: "autocomplete",
              name: "userId",
              label: "usuario",
              initialValue: 0,
              width: 6,
              options: userOptions,
              valueKey: "id",
              descriptionKey: "description",
            },
            {
              type: "autocomplete",
              name: "permissionId",
              label: "permissao",
              initialValue: 0,
              width: 6,
              options: permissionOptions,
              valueKey: "id",
              descriptionKey: "description",
            },
            {
              type: "radio",
              name: "scope",
              title: "Escopo",
              width: 12,
              initialValue: "tenant",
              options: [
                { description: "Tenant atual", value: "tenant" },
                { description: "Global (todos os tenants)", value: "global" },
              ],
            },
            {
              type: "text",
              name: "tenantId",
              label: "tenant id (opcional)",
              initialValue: null,
              width: 6,
            },
          ],
        },
      ],
      (path) => {
        required(path.userId);
        required(path.permissionId);
      }
    );

    forkJoin({
      users: usersHttp.findAll(),
      permissions: permissionsHttp.findAll(),
    }).subscribe(({ users, permissions }) => {
      userOptions.push(
        ...users.map((user) => ({
          id: user.id,
          description: user.email ?? `Usuario #${user.id}`,
        }))
      );
      permissionOptions.push(
        ...permissions.map((permission) => ({
          id: permission.id,
          description: permission.code,
        }))
      );
      this.ready.set(true);
    });
  }
}
