
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
        :host{
          display: flex;
          gap: 16px;
        }
    `,
  ],
  template: `
    <div style="display:none" #categoryTarget></div>
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

  ngOnDestroy() {
    console.log("destroy ribbon");
  }
}
