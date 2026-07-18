import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { ServiceOrderLookupContract } from "@interfaces/service-order-lookup.contract";
import { ServiceOrderContract } from "@interfaces/service-order.contract";
import { Observable, tap } from "rxjs";
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

  lookup(): Observable<ServiceOrderLookupContract[]> {
    const fullUrl = `${this._url}/lookup`;

    this._loadingFind.set(true);
    return this._httpClient
      .get<ServiceOrderLookupContract[]>(fullUrl, {
        responseType: "json",
        withCredentials: true,
      })
      .pipe(tap(() => this._loadingFind.set(false)));
  }
}
