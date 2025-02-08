import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { InputTextComponent } from "@client/common/components/app-input-text.component";
import { environment } from "apps/client/src/environments/environment.prod";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    selector:"app-page-products",
    encapsulation:ViewEncapsulation.None,
    imports:[
        InputTextComponent
    ],
    // styles:[`
    //     :host{
    //         display:block;
    //         height:100%;
    //     }`
    // ],
    template:`
    <div class="flex h-full bg- flex-center">
      Products
    </div>`    
})
export class PageProductsComponent {
    constructor(){
      console.log(environment.apiUrl); 
    }
}

