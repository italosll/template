import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms"
import { TemplateService } from "../templates/app-template.service";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    selector:"app-sidenav",
    providers:[
        TemplateService,
    ],
    imports:[
        CommonModule,
        FormsModule,
        RouterLink,
        RouterLinkActive
    ],
    template:`
        <div class="w-52 flex flex-col h-full bg-primary-dark p-3">
            <img
                class="rounded-lg h-20 opacity-90 w-full"
                [src]="templateServico.companyRectangularLogo()"
            />
            @for(item of templateServico.navigationItems(); track item.path){
                <a
                    class="text-white"
                    [routerLink]="item.path"
                    routerLinkActive="active"
                >{{item.title}}</a>
            }
        </div>
    `,
})
export class SidenavComponent{
    protected templateServico = inject(TemplateService);
}