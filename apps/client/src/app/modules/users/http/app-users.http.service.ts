import { ProductContract } from "@interfaces/product.contract";
import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { getUsersRoutes } from "../app-index.routes";

@Injectable()
export class UsersHttpService extends BaseHttpService<ProductContract> {
  constructor() {
    super(getUsersRoutes().api.users);
  }
}
