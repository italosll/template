import { inject, Injectable } from "@angular/core";
import { SignInContract } from '@interfaces/sign-in.contract';
import { AccessHttpService } from '../http/app-access.http.service';
import { Router } from '@angular/router';
import { map, switchMap, tap } from "rxjs";
import { getStartRoutes } from "@client/start/app-index.routes";
import { getIamRoutes } from "../app-index.routes";

@Injectable({
    providedIn: 'root'
})
export class AccessService  {
    private _accessHttpService = inject(AccessHttpService);
    private _router = inject(Router);

    public signIn = (signIn: SignInContract) => this._accessHttpService.signIn(signIn).pipe(
        switchMap(
            () =>  this._router.navigate([getStartRoutes().client.start.path])
        )
    )
    public signOut = async () => {
        await this._router.navigate([getIamRoutes().client.signIn])
    };
}