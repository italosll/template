import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { getServiceOrdersRoutes } from "../app-index.routes";

@Injectable()
export class ServiceOrdersHttpService extends BaseHttpService<
  ServiceOrderContract,
  ServiceOrderContract,
  ServiceOrderContract,
  ServiceOrderContract
> {
  constructor() {
    super(getServiceOrdersRoutes().api.serviceOrders);
  }
}
