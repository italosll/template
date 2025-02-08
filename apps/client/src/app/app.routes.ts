import { Route } from '@angular/router';
import { TemplateComponent } from '@client/common/components/templates/app-template.component';
import * as IAM from '@client/iam/index.routes';
import * as Products from '@client/products/index.routes';
import * as Users from '@client/users/index.routes';



export const appRoutes: Route[] = [
    ...IAM.routes,
    {
        path:"",
        component:TemplateComponent,
        children:[
            ...Products.routes,
            ...Users.routes

        ]
    }
];
