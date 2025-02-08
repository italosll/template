import { computed, inject, Injectable, signal } from "@angular/core";
import { TemplateComponent } from "./app-template.component";
import { Route, Router } from "@angular/router";
import * as Product from "@client/products/index.routes";
import * as Users from "@client/users/index.routes";

import { NavigationItemModel } from "@client/common/model/app-navigation-item";


@Injectable({
    providedIn:TemplateComponent
})
export class TemplateService{


    private _router = inject(Router);
    private _navigationItems = signal<NavigationItemModel[]>([]);
    private _titlesToDisplayOnSidenav = ["Produtos", "Usuários"];
    public navigationItems = computed(()=> this._navigationItems());
    public companyRectangularLogo = computed(()=> "https://imagenes.elpais.com/resizer/v2/Y3W6QUFBBZLLTALRW6NBRPZ2RA.jpg?auth=d68f18251117888479d8fdc3210796bc86d9d3f41719da72c2877bcafc3504ea&width=1200");

    constructor(){

        const allRoutes = [ ...Product.routes, ...Users.routes ];
        const routes = allRoutes.filter(({title})=> this._titlesToDisplayOnSidenav.filter((t)=>t ===title));
        const navigationItems = routes.map(({title,path})=> new NavigationItemModel(title as string, path as string));
        this._navigationItems.set(navigationItems);
        // this._navigationItems
    }
    

}