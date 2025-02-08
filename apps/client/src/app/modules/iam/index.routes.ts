/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const routes: Route[] = [
    {
        path:"login",
        loadComponent: ()=> import("@client/iam/pages/app-page-login.component").then((m)=>m.LoginComponent),
    }
];
