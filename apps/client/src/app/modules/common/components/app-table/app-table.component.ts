import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ControlValueAccessor, FormsModule } from "@angular/forms"
import { BaseInputDirective } from "../../directives/app-base-input.directive";

@Component({
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone:true,
    selector:"app-table",
    imports:[
        CommonModule,
        FormsModule
    ],
    template:`
      <table>
      <tbody class="border-[1px] border-black">
        <tr >
          <th class="border-[1px] border-black" *ngFor="let field of items()[0] | keyvalue">{{field.key}}</th>
        </tr>
        <tr *ngFor="let item of items()">
          <td class="border-[1px] border-black" *ngFor="let field of item | keyvalue">{{field.value}}</td>
        </tr>
      </tbody>
    </table>
    `,
})
export class TableComponent{
    items= input.required<object[]>();
    
}