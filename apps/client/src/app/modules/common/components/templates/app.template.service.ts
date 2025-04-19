import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { TemplateComponent } from "./app.template.component";
import {  ActivatedRoute, NavigationEnd, Router } from "@angular/router";
 

import { NavigationItemModel } from "@client/common/model/app-navigation-item";
import { getProductsRoutes } from "@client/products/app-index.routes";
import { getUsersRoutes } from "@client/users/app-index.routes";
import { getStartRoutes } from "@client/start/app-index.routes";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";

@Injectable({
    providedIn:TemplateComponent
})
export class TemplateService{


    private _router = inject(Router);
    private _activatedRoute = inject(ActivatedRoute);

    private _navigationItems = signal<NavigationItemModel[]>([]);
    private _currentActiveUrl$ = this._router.events.pipe(
    takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
            map((event) => (event as NavigationEnd).url)
    );

    private _currentAtiveUrl = toSignal(this._currentActiveUrl$);

    public navigationItems = computed(()=> this._navigationItems().map((item)=>{
        item.active =  !!this._currentAtiveUrl()?.includes(item.path);
        return item;
    }) );
    public companyRectangularLogo = computed(()=> "https://imagenes.elpais.com/resizer/v2/Y3W6QUFBBZLLTALRW6NBRPZ2RA.jpg?auth=d68f18251117888479d8fdc3210796bc86d9d3f41719da72c2877bcafc3504ea&width=1200");

    constructor(){
  
        const routes = [ 
            getStartRoutes().client.start,
            getProductsRoutes().client.products,
            getUsersRoutes().client.users,

        ];
        const navigationItems = routes.map(({title,path,icon})=> new NavigationItemModel(title, path, icon));
        this._navigationItems.set(navigationItems);
    }
    

}