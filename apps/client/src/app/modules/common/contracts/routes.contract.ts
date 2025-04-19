import { Route } from "@angular/router"

export interface RoutesContract {
    client: {
        [x:string]:{
            path:string,
            title:string,
            icon?:string,
        }
    },
    api: {
        [x:string]:string
    },
    angular: Route[]
}
