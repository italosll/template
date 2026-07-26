import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionsService } from "@client/common/services/app-permissions.service";
import { getStartRoutes } from "@client/start/app-index.routes";
import { SignInContract } from "@interfaces/sign-in.contract";
import { switchMap, tap } from "rxjs";
import { getIamRoutes } from "../app-index.routes";
import { AccessHttpService } from "../http/app-access.http.service";

@Injectable({
  providedIn: "root",
})
export class AccessService {
  private _accessHttpService = inject(AccessHttpService);
  private _permissions = inject(PermissionsService);
  private _router = inject(Router);

  public signIn = (signIn: SignInContract) =>
    this._accessHttpService
      .signIn(signIn)
      .pipe(
        tap(() => this._permissions.clear()),
        switchMap(() => this._permissions.load(true)),
        switchMap(() =>
          this._router.navigate([getStartRoutes().client.start.path])
        )
      );
  public signOut() {
    return this._accessHttpService
      .signOut()
      .pipe(
        tap(() => this._permissions.clear()),
        switchMap(() =>
          this._router.navigate([getIamRoutes().client.signIn.path])
        )
      );
  }
}
