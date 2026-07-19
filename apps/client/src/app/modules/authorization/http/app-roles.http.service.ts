import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { RoleContract } from "@interfaces/role.contract";
import { getAuthorizationRoutes } from "../app-index.routes";

export type RoleListItem = RoleContract & {
  permissionsLabel?: string;
};

@Injectable()
export class RolesHttpService extends BaseHttpService<
  RoleListItem,
  RoleContract,
  RoleContract,
  RoleContract
> {
  constructor() {
    super(getAuthorizationRoutes().api.roles);
  }
}
