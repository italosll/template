import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component} from "@angular/core";
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router";
import { TemplateService } from "./app.template.service";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { SidenavComponent } from "../app-sidenav/app-sidenav.component";
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        TemplateService,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatDividerModule,
        RouterModule,
        SidenavComponent
    ],
    styles: [
        `   
            nav{
                height: 64px;
                background-color: white;
            }

            mat-drawer-container{
                height: calc(100% - 64px);
            }
        `
    ],
    template: `
        <nav>
            header
        </nav>
        <mat-divider></mat-divider>
        <mat-drawer-container>
            <mat-drawer mode="side" opened="true">
                <app-sidenav/>
            </mat-drawer>
            <mat-drawer-content>
                <router-outlet></router-outlet>
            </mat-drawer-content>
        </mat-drawer-container>
    `
})
export class TemplateComponent{ 

}