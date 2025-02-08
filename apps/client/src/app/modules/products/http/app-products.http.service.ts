import { ProductContract} from '@interfaces/product.contract';
import { Injectable } from "@angular/core";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { routes } from '../app-api.routes';

@Injectable({
    providedIn: 'root'
})
export class ProductsHttpService extends BaseHttpService<ProductContract> {
    constructor(){
        super(routes.product)
    }
}