import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { getStartRoutes } from "@client/start/app-index.routes";
import { SignInContract } from "@interfaces/sign-in.contract";
import { switchMap } from "rxjs";
import { getIamRoutes } from "../app-index.routes";
import { AccessHttpService } from "../http/app-access.http.service";

@Injectable({
  providedIn: "root",
})
export class AccessService {
  private _accessHttpService = inject(AccessHttpService);
  private _router = inject(Router);

  public signIn = (signIn: SignInContract) =>
    this._accessHttpService
      .signIn(signIn)
      .pipe(
        switchMap(() =>
          this._router.navigate([getStartRoutes().client.start.path])
        )
      );
  public signOut() {
    return this._accessHttpService
      .signOut()
      .pipe(
        switchMap(() =>
          this._router.navigate([getIamRoutes().client.signIn.path])
        )
      );
  }
}
