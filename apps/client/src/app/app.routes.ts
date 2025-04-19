import { Route } from '@angular/router';
import { TemplateComponent } from '@client/common/components/templates/app.template.component';
import { getIamRoutes } from '@client/iam/app-index.routes';
import { getProductsRoutes } from '@client/products/app-index.routes';
import { getStartRoutes } from '@client/start/app-index.routes';
import { getUsersRoutes } from '@client/users/app-index.routes';
 

export const appRoutes: Route[] = [
    ...getIamRoutes().angular,
    {
        path:"",
        component:TemplateComponent,
        children:[
            ...getStartRoutes().angular,
            ...getProductsRoutes().angular,
            ...getUsersRoutes().angular,
        ]
    }
];
