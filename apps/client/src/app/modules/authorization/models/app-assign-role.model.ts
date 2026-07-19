import { inject, signal } from "@angular/core";
import { required } from "@angular/forms/signals";
import { FormModel } from "@client/common/model/app-form.model";
import { AssignRoleContract } from "@interfaces/assign-role.contract";
import { forkJoin } from "rxjs";
import { UsersHttpService } from "@client/users/http/app-users.http.service";
import { RolesHttpService } from "../http/app-roles.http.service";

export type AssignRoleFormValue = AssignRoleContract & {
  scope?: "tenant" | "global";
};

export class AssignRoleModel extends FormModel<AssignRoleFormValue> {
  readonly ready = signal(false);

  constructor() {
    const userOptions: object[] = [];
    const roleOptions: object[] = [];
    const usersHttp = inject(UsersHttpService);
    const rolesHttp = inject(RolesHttpService);

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
              name: "roleId",
              label: "cargo",
              initialValue: 0,
              width: 6,
              options: roleOptions,
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
        required(path.roleId);
      }
    );

    forkJoin({
      users: usersHttp.findAll(),
      roles: rolesHttp.findAll(),
    }).subscribe(({ users, roles }) => {
      userOptions.push(
        ...users.map((user) => ({
          id: user.id,
          description: user.email ?? `Usuario #${user.id}`,
        }))
      );
      roleOptions.push(
        ...roles.map((role) => ({
          id: role.id,
          description: role.name,
        }))
      );
      this.ready.set(true);
    });
  }
}
