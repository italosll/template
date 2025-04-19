import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, HostBinding, inject, input } from "@angular/core";
import { FormsModule } from "@angular/forms"
import { TemplateService } from "../templates/app.template.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AccessService } from "@client/iam/services/app-access.service";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { NavigationItemModel } from "@client/common/model/app-navigation-item";
import { MatButtonModule } from "@angular/material/button";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-sidenav',  
    providers:[
        TemplateService,
        AccessService
    ],
    imports:[
        CommonModule,
        FormsModule,
        RouterLink,
        RouterLinkActive,
        MatIconModule,
        MatSidenavModule,
        MatButtonModule
    ],
    styles:[
        
        `     
            :host{
                display:block;
                padding:0.5rem

        }
        a{
                display:flex;
                justify-content: flex-start;                
            }
        
        `
    ],
    template:`
            @for(navigationItem of navigationItems(); track navigationItem.path ){
                <a
                    [style]="{color: navigationItem.active ? 'var(--primary-color)' : 'black'}"
                    mat-flat-button 
                    [routerLink]="navigationItem.path"
                    routerLinkActive="active"
                    >
                    <mat-icon>{{navigationItem.icon}}</mat-icon>    
                    <span>
                        {{navigationItem.title}}
                    </span>
                
                </a>
            }
    `,
})
export class SidenavComponent{
    private _templateServico = inject(TemplateService);
    protected navigationItems =computed(()=> this._templateServico.navigationItems());
}