/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { RoutesContract } from '@client/common/contracts/routes.contract';

export function getStartRoutes(){

    const client={
        start:{
            title:"Página inicial",
            path:"inicio",
            icon:"home"
        }
    }

    const api= {}

    const angular : Route[] = [
        {
            title: client.start.title,
            path: client.start.path,
            loadComponent: ()=> import("@client/start/pages/app-page-start.component").then((m)=>m.PageStartComponent),
        }
    ];

    return{
        client,
        api,
        angular
    } satisfies RoutesContract
}

 
