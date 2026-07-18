import { Route } from '@angular/router';
import { TemplateComponent } from '@client/common/components/templates/app.template.component';
import { getIamRoutes } from '@client/iam/app-index.routes';
import { getProductsRoutes } from '@client/products/app-index.routes';
import { getStartRoutes } from '@client/start/app-index.routes';
import { getUsersRoutes } from '@client/users/app-index.routes';
import { getServiceOrdersRoutes } from './modules/service-orders/app-index.routes';
import { getClientsRoutes } from './modules/clients/app-index.routes';
import { getQuotationsRoutes } from './modules/quotations/app-index.routes';


export const appRoutes: Route[] = [
    ...getIamRoutes().angular,
    {
        path:"",
        component:TemplateComponent,
        children:[
            ...getStartRoutes().angular,
            ...getProductsRoutes().angular,
            ...getServiceOrdersRoutes().angular,
            ...getClientsRoutes().angular,
            ...getQuotationsRoutes().angular,
            ...getUsersRoutes().angular,
        ]
    }
];
