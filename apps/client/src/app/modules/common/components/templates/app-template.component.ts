import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { FormsModule } from "@angular/forms"
import { RouterOutlet } from "@angular/router";
import { TemplateService } from "./app-template.service";
import { SidenavComponent } from "../app-sidenav/app-sidenav.component";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    providers:[
        TemplateService
    ],
    imports:[
        CommonModule,
        FormsModule,
        RouterOutlet,
        SidenavComponent
    ],
    template:`
        <div class="flex flex-row w-auto h-full bg-red-400">
        <app-sidenav></app-sidenav>         
            <div class="flex flex-col w-full h-full">
                <div class="w-auto bg-200 h-14"></div>
            <router-outlet></router-outlet>  
            </div>            
        </div>
    `,
})
export class TemplateComponent{
        private _templateServico = inject(TemplateService);


        constructor(){
            effect(()=>{

                // console.log("--------")
                
                // console.log(this._templateServico.navigationItems())
            })
        }
    

}