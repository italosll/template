/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { RoutesContract } from '@client/common/contracts/routes.contract';
import path from 'path';

export function getIamRoutes(){

    const client={
        signIn:{
            path:"entrar",
            title:"Entrar"
        }
     }

    const api= {
        signIn:`/api/authentication/sign-in`
    } as const

    const angular : Route[] = [
        {
            title:client.signIn.title,
            path:client.signIn.path,
            loadComponent: ()=> import("@client/iam/pages/app-page-sign-in.component").then((m)=>m.SignInComponent),
        }
    ];

    return{
        client,
        api,
        angular
    } satisfies RoutesContract
}