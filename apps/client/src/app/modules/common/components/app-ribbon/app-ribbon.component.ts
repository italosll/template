import { RibbonCategoryContract, RibbonItemContract } from './../../contracts/ribbon.contract';
import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, HostBinding, inject, Injector, input, output, runInInjectionContext, viewChild, ViewContainerRef } from "@angular/core";
import { FormsModule } from "@angular/forms"
import { TemplateService } from "../templates/app.template.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AccessService } from "@client/iam/services/app-access.service";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { NavigationItemModel } from "@client/common/model/app-navigation-item";
import { MatButtonModule } from "@angular/material/button";
import { run } from 'node:test';
import { After } from 'v8';
import { RibbonCategoryItemComponent } from './app-ribbon-category-item.component';
import { provideRibbonItem } from './app-ribbon-category-item.provider';
import { CustomRibbonItemModel, RibbonItemModel } from '@client/common/model/app-ribbon-item.model';


@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    selector: 'app-ribbon',  
    providers:[
    ],
    imports:[
        CommonModule,
        FormsModule,
        MatIconModule,
        MatSidenavModule,
        MatButtonModule
    ],
    styles:[
        
        `     
        //     :host{
        //         display:block;
        //         padding:0.5rem

        // }
 
        
        `
    ],
    template:`
        <div #categoryTarget></div>
        <!-- @for(category of categories(); track category.title ){
            @for(item of category.items; track item.title){
                
                <button mat-flat-button (click)=" 
                runFunctionInInjectionContext(item?.click)">
                    <mat-icon>{{item.icon}}</mat-icon>    
                    <span>
                        {{item.title}}
                    </span>
                </button>
            }
        } -->
    `,
})
export class RibbonComponent implements AfterViewInit{
    public categories = input.required<RibbonCategoryContract[]>();
    public clickItem = output<string>();
    private _injector = inject(Injector);

    private _categoryTargetRef = viewChild("categoryTarget",{
        read:ViewContainerRef
    });

    private _changeDetectorRef = inject(ChangeDetectorRef);

    public ngAfterViewInit(){

        console.log(this._categoryTargetRef());
        // const teste = this._categoryTargetRef()?.createComponent(RibbonCategoryItemComponent,
        //     {
        //         injector: Injector.create({
        //             parent: this._injector,
        //             providers: [
        //                ...provideRibbonItem(new RibbonItemModel("Teste",""))
        //             ]
        //         }),
        //     }
        // )

        // this._changeDetectorRef.detectChanges();

        // console.log(teste);
        this.categories().forEach(category => {
            category.items.forEach(item => {
                // console.log("item")
                // console.log(item)

                const component = item instanceof CustomRibbonItemModel ? item.component : null;
if(!component) return;
                this._categoryTargetRef()?.createComponent(component,{
                    injector: Injector.create({
                        parent: this._injector,
                        providers: [
                           ...provideRibbonItem(item)
                        ]
                    }),
                })
            })
        })
    }

    // protected emitClickItem(categoryTitle:RibbonCategoryContract["title"] , itemTitle: RibbonCategoryContract["items"][0]["title"]){
    //     this.clickItem.emit(`${categoryTitle}-${itemTitle}`);
    // }

    // protected runFunctionInInjectionContext(functionClick:RibbonItemContract["click"]){
    //     runInInjectionContext(this._injector,(async () => {
    //         if(functionClick) await functionClick();
    //     }))
    // }

    ngOnDestroy(){
        console.log("destroy ribbon");
    }

}