import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from "@angular/core";
import { InputTextComponent } from "@client/common/components/app-input-text.component";
import { environment } from "apps/client/src/environments/environment.prod";
import { TableComponent } from "../../common/components/app-table/app-table.component";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    selector:"app-page-products",
    encapsulation:ViewEncapsulation.None,
    imports: [
    TableComponent
],
    template:`
    <div class="flex flex-col h-full bg-green-200 flex-center">
      Products   
    <app-table [items]="items()"/>
    </div>`    
})
export class PageProductsComponent {
    constructor(){
      console.log(environment.apiUrl); 
    }
    items = signal ([
      { id: 'one', status: 'complete', task: 'build' },
      { id: 'two', status: 'working', task: 'test' },
      { id: 'three', status: 'failed', task: 'deploy' },
    ])
        
}

