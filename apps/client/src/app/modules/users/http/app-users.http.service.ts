import { UserContract } from "@interfaces/user.contract";
import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { getUsersRoutes } from "../app-index.routes";

@Injectable()
export class UsersHttpService extends BaseHttpService<
  UserContract,
  UserContract,
  UserContract,
  UserContract
> {
  constructor() {
    super(getUsersRoutes().api.users);
  }
}
