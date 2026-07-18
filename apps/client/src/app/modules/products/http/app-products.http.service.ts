import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { ProductLookupContract } from "@interfaces/product-lookup.contract";
import { ProductContract } from "@interfaces/product.contract";
import { Observable, tap } from "rxjs";
import { getProductsRoutes } from "../app-index.routes";

@Injectable()
export class ProductsHttpService extends BaseHttpService<
  ProductContract,
  ProductContract,
  ProductContract,
  ProductContract
> {
  constructor() {
    super(getProductsRoutes().api.products);
  }

  lookup(): Observable<ProductLookupContract[]> {
    const fullUrl = `${this._url}/lookup`;

    this._loadingFind.set(true);
    return this._httpClient
      .get<ProductLookupContract[]>(fullUrl, {
        responseType: "json",
        withCredentials: true,
      })
      .pipe(tap(() => this._loadingFind.set(false)));
  }
}
