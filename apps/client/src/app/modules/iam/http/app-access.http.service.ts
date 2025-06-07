import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ProductContract } from "@interfaces/product.contract";
import { SignInContract } from "@interfaces/sign-in.contract";
import { getIamRoutes } from "../app-index.routes";

@Injectable({
  providedIn: "root",
})
export class AccessHttpService {
  private _httpClient = inject(HttpClient);

  public signIn = (payload: SignInContract) =>
    this._httpClient.post<ProductContract>(getIamRoutes().api.signIn, payload);

  public signOut = () => this._httpClient.post(getIamRoutes().api.signOut, {});
}
