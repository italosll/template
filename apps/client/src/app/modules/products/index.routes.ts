/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const routes: Route[] = [
    {
        title:"Produtos",
        path:"produtos",
        loadComponent: ()=> import("@client/products/pages/app-page-products.component").then((m)=>m.PageProductsComponent),
    }
];
