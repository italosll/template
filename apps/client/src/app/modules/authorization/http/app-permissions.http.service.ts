import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { PermissionContract } from "@interfaces/permission.contract";
import { getAuthorizationRoutes } from "../app-index.routes";

@Injectable()
export class PermissionsHttpService extends BaseHttpService<
  PermissionContract,
  PermissionContract,
  PermissionContract,
  PermissionContract
> {
  constructor() {
    super(getAuthorizationRoutes().api.permissions);
  }
}
