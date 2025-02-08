/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const routes: Route[] = [
    {
        title:"Usuários",
        path:"users",
        loadComponent: ()=> import("@client/users/pages/app-page-users.component").then((m)=>m.PageUsersComponent),
    }
];
