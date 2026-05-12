import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  signal,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ControlValueAccessor, FormBuilder, FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldControl } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FileUtil } from "@client/common/utils/app-file.util";
import { FileContract } from "@interfaces/file.contract";
import { debounceTime, distinctUntilChanged, Subject, take } from "rxjs";
import { BaseInputDirective } from "../../directives/app-base-input.directive";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { BaseHttpService } from "@client/common/http/app-base.http.service";
import { DataSourceService } from "@client/common/services/app-data-source.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: "app-search-bar",
  encapsulation: ViewEncapsulation.Emulated,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule
],
  providers: [

  ],
  template: `
      <mat-form-field class="w-150" subscriptSizing="dynamic">
        <mat-label>Pesquisar</mat-label>
        <input matInput type="text" [(ngModel)]="searchText">
        @if (searchText().length) {
          <button matSuffix matIconButton aria-label="Clear" style="margin-right: 10px" (click)="searchText.set('')">
            <mat-icon>close</mat-icon>
          </button>
        }@else{
          <mat-icon matSuffix>search</mat-icon>
        }
      </mat-form-field>
  `,
})
export class SearchBarComponent {
  // private _router: Router = inject(Router);
  private readonly _httpService = inject(BaseHttpService);
  private readonly _dataSource = inject(DataSourceService);

  protected readonly  searchText = signal("");
  protected readonly  searchText$ = toObservable(this.searchText)

  constructor(){
    this.searchText$.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe((text)=> this.search((text)));
  }

  public search(text:string){
    this._httpService.findByText(text).pipe(take(1))
      .subscribe((res)=> this._dataSource.setData((res)));
  }
}
