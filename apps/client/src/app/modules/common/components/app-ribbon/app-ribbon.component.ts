
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  input,
  OnDestroy,
  output,
  viewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CustomRibbonItemModel } from "@client/common/model/app-ribbon-item.model";
import { RibbonCategoryContract } from "./../../contracts/ribbon.contract";
import { provideRibbonItem } from "./app-ribbon-category-item.provider";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: "app-ribbon",
  providers: [],
  imports: [
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule
],
  styles: [
    `
      //     :host{
      //         display:block;
      //         padding:0.5rem

      // }
    `,
  ],
  template: `
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
export class RibbonComponent implements AfterViewInit, OnDestroy {
  public categories = input.required<RibbonCategoryContract[]>();
  public clickItem = output<string>();
  private _injector = inject(Injector);

  private _categoryTargetRef = viewChild("categoryTarget", {
    read: ViewContainerRef,
  });

  private _changeDetectorRef = inject(ChangeDetectorRef);

  public ngAfterViewInit() {
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

    this.categories().forEach((category) => {
      category.items.forEach((item) => {
        const component =
          item instanceof CustomRibbonItemModel ? item.component : null;
        if (!component) return;
        this._categoryTargetRef()?.createComponent(component, {
          injector: Injector.create({
            parent: this._injector,
            providers: [...provideRibbonItem(item)],
          }),
        });
      });
    });
  }

  // protected emitClickItem(categoryTitle:RibbonCategoryContract["title"] , itemTitle: RibbonCategoryContract["items"][0]["title"]){
  //     this.clickItem.emit(`${categoryTitle}-${itemTitle}`);
  // }

  // protected runFunctionInInjectionContext(functionClick:RibbonItemContract["click"]){
  //     runInInjectionContext(this._injector,(async () => {
  //         if(functionClick) await functionClick();
  //     }))
  // }

  ngOnDestroy() {
    console.log("destroy ribbon");
  }
}
